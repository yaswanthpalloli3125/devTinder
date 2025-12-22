const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {User} = require("../models/user");
const {validateData} = require("../utils/validate");
const {passwordValidation} = require("../models/user")

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
    await newUser.save();
    res.send("user added successfully");
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
        const token = await user.getToken();//1hr
       
        res.cookie("token", token);

        res.send("login successful");
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

module.exports = authRouter;