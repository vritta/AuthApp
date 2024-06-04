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
        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:'Existing user is not registered',
            });
        }

        const payload = {
            email: user.email,
            id:user._id,
            role:user.role,
        }
        // verify password and generate JWT token
        if(await bcrypt.compare(password, existingUser.password)){
            // password match
            let token = jwt.sign(payload, 
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                }
            );
            existingUser.token = token;
            existingUser.password = undefined;

            res.cookie
        }
    }
    catch(err){
        console.log("error in signup method");
    }
}