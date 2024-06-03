const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
// require("./config/database").connect();
const dbConnect = require("./config/database");
dbConnect();

//route import and mount
const user = require("./routes/user");
app.use("/app/v1/", user);

//activate server
app.listen(PORT, ()=>{
    console.log(`App is listening at ${PORT}`);
})