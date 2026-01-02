const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {User} = require("../models/user");
const {validateData} = require("../utils/validate");


authRouter.post("/usersignup", async (req, res) => {
  try {
    validateData(req.body);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    
    const savedUser= await newUser.save();
     const token = await savedUser.getToken();
       
        res.cookie("token", token);

    res.json({message:"user added successfully",data:savedUser});
  } catch (error) {
    res.status(400).send("something went wrong " + error.message);
  }
});

authRouter.post("/userlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const validPassword = await user.passwordValidation(password);
     
      if (validPassword) {
        const token = await user.getToken();
       
        res.cookie("token", token);

        res.send(user);
      } else {
        throw new Error("Invalid credentials");
      }
    } else {
      throw new Error("Inavalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

authRouter.post("/userforgotpassword",async(req,res)=>{
    const userProvidedEmail = req.body.email;
    const userOldPassword = req.body.password;
    const userNewPassword = req.body.newpassword;
    
    try {
         if(!userProvidedEmail){
        throw new Error("Invalid email")
    }
      const user = await User.findOne({email:userProvidedEmail});
      if(!user.passwordValidation(userOldPassword)){
           throw new Error("password not valid");
      }
      const passwordHash = await bcrypt.hash(userNewPassword,10)
      user.password = passwordHash;
      await user.save();
      res.send("password updated");
    } catch (error) {
        res.status(400).send("Error "+ error.message)
    }
   

})

authRouter.post("/userlogout",async(req,res)=>{
  res.cookie("token",null,{expires:new Date(Date.now())}).send("logged out successfully")
})

module.exports = authRouter;