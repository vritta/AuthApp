const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//signup route handler
exports.signup = async (req, res)=>{
    try{
        // get data
        const {name, email, password, role} = req.body;
        // check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: 'User already exists',
            });
        }
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in hashing Password',
            });
        }

        // create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role
        });
        return res.status(200).json({
            success:true,
            message:'User created successfully',
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
};
exports.login = async (req, res)=>{
    try{
        // get data
        const {email, password} = req.body;
        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Please fill all the details carefully',
            });
        }
        // check if user already exist
        let existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                success:false,
                message:'Existing user is not registered',
            });
        }

        const payload = {
            email: existingUser.email,
            id:existingUser._id,
            role:existingUser.role,
        }
        // verify password and if it's correct then generate JWT token
        // password match
        if(await bcrypt.compare(password, existingUser.password)){
            // generate token
            let token = jwt.sign(payload, 
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                }
            );
            existingUser = existingUser.toObject();
            existingUser.token = token;
            existingUser.password = undefined;
            const options = {
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                existingUser,
                message:'User logged in successfully',
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });
    }
}