const express = require("express");
const {adminAuth,userAuth} = require("./middleWares/auth")
const app = express();

app.get("/user",(req,res,next)=>{
    try{
     throw new Error("404 not forund");
    res. send("user details");
    }
    catch(err){
      res.status(404).send("from catch error")
    }
    
})

app.use("/",(err,req,res,next)=>{
    if(err){
    res.status(404).send("Something went wrong...")
    }
})






app.listen(7777,()=>{
    console.log("server is running on port 7777");
});



