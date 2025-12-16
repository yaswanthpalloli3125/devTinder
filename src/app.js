const express = require("express");
const app = express();

app.use("/user",(req,res,next)=>{
    console.log("1st routeHandler");
    next();
},
[(req,res,next)=>{
    console.log("2nd routeHandler");
    next();
},
(req,res,next)=>{
    console.log("3rd routrHandler");
    next();
}],
(req,res,next)=>{
    console.log("4th routeHandler");
    res.send("4th responce");
}
)



app.listen(7777,()=>{
    console.log("server is running on port 7777");
});