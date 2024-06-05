const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next)=>{
    try{
        // extract JWT token
        // PENDING: other ways to fetch token
        const token = req.body.token ;
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        } catch(err){
            console.error(err)
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            });
        }
        next();
    } catch(err){
        return res.status(401).json({
            success: false,
            message:"Something went wrong, while verifying the token",
        });
    }
}

exports.isStudent = ()=>(req,res,next)=>{
    try{
        if(req.user.role != "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for students',
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success: false,
            message:"User role is not matching",
        });
    }
}

exports.isAdmin = (req, res, next)=>{
    try{
        if(req.user.role != "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for students',
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success: false,
            message:"User role is not matching",
        });
    }
}