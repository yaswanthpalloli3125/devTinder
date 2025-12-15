const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
   res.send({firstName:"yaswanth",lastName:"Palloli"})
})
app.post("/user",(req,res)=>{
    res.send("user created successfully");
 })
 app.delete("/user",(req,res)=>{
    res.send("user deleted successfully");
 })
app.use("/test", (req,res)=>{
    res.send("hello from test");
})


app.listen(7777,()=>{
    console.log("server is running on port 7777")
})