const express = require("express");
const connectDB = require("./databse")
const {adminAuth,userAuth} = require("./middleWares/auth")
const {User} = require("./models/user");
const app = express();

app.post("/signup", async (rq,res,next)=>{
    const newUser = new User({
        firstName:"Yaswanth",
        lastName:"Palloli",
        age:25,
        gender:"Male"
    })
   try{
       await newUser.save();
    res.send("user added succesfully");
   }catch(err){
       res.status(400).send("error in saving user data"+ err.message);
   }
})


connectDB().then(()=>{
    console.log("connection established to database");
    app.listen(7777,()=>{
    console.log("server is running on port 7777");
});

}).catch(err=>console.log("connection cannot established to database"));




