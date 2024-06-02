const mongoose = require("mongoose");
require("dotenv").config;
const DATABASE_URL = process.env.DATABASE_URL;

connect = ()=>{
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{console.log("Database is connected successfully")})
    .catch((err)=>{
        console.log("DB Connection issues");
        console.error(err);
        process.exit(1);
    });
}

module.exports =  connect;