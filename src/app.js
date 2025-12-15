const express = require("express");
const app = express();

app.use("/home", (req,res)=>{
   res.send("Hello from home");
})

app.use("/test", (req,res)=>{
    res.send("hello from test");
})

app.listen(7777,()=>{
    console.log("server is running on port 7777")
})