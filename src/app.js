const express = require("express");
const {adminAuth,userAuth} = require("./middleWares/auth")
const app = express();

app.use("/admin",adminAuth);

app.get("/admin/alldata",(req,res,next)=>{
    res.send("all admin data sent");
})
app.delete("/admin/deletedata",(req,res,next)=>{
    res.send("admin data deleted");
})

app.get("/user",(req,res,next)=>{
    res.send("user into login page")
})


app.use("/user",userAuth)
app.get("/user/details",(req,res,next)=>{
    res.send("user details fetched");
})




app.listen(7777,()=>{
    console.log("server is running on port 7777");
});



