const bcrypt = require("bcrypt");
const User = require("../models/User");

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
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}
exports.login = async (req, res)=>{
    try{
        // get data
        const {email, password} = req.body;
        // check if user already exist
        const 
    }
    catch(err){
        console.log("error in signup method");
    }
}