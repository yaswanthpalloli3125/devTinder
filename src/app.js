const express = require("express");
const connectDB = require("./databse");
const { adminAuth, userAuth } = require("./middleWares/auth");
const { User } = require("./models/user");
const app = express();

app.use(express.json());

 app.get("/userdetails",async (req,res)=>{
 const userAge = req.body.age;
    try{
      
       const users = await User.find({age:userAge});
       if(users.length===0){
        res.status(404).send("user not found")
       }else{
        res.send(users);
       }
    }catch(err){
        res.status(400).send("something went wrong")
    }
 })
  
 app.delete("/userdelete", async (req,res)=>{
      const userId = req.body.userId;
       try {
         const user = await User.findByIdAndDelete(userId);
         if(user){
             res.send("user deleted successfully")
         }
         else{
            res.status(404).send("user not found")
         }
       } catch (error) {
           res.status(400).send("something went wrong")
       }
 })

 app.patch("/userupdate",async (req,res)=>{
    const userId = req.body.userId;
    console.log(userId)
    const data = req.body;
    console.log(data)
    try {
      await User.findByIdAndUpdate(userId,data);
        
      res.send("user updated")
    } catch (error) {
        res.status(400).send("something went wrong");
    }
 })


connectDB()
  .then(() => {
    console.log("connection established to database");
    app.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => console.log("connection cannot established to database"));
