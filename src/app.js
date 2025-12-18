const express = require("express");
const connectDB = require("./databse");
const { adminAuth, userAuth } = require("./middleWares/auth");
const { User } = require("./models/user");
const {validateData} = require("./utils/validate");
const bcrypt = require("bcrypt")
const app = express();

app.use(express.json());

app.post("/usersignup", async (req, res) => {
  
  try {
      validateData(req.body);
    const {firstName,lastName,email,password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: passwordHash
  });
    await newUser.save();
    res.send("user added successfully");
  } catch (error) {
    res.status(400).send("something went wrong "+ error.message);
  }
});

app.get("/userdetails", async (req, res) => {
  const userAge = req.body.age;
  try {
    const users = await User.find({ age: userAge });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/userdelete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (user) {
      res.send("user deleted successfully");
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/userupdate/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const allowedDataToUpdate = ["age", "gender","photoUrl"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedDataToUpdate.includes(k)
    );
    console.log("1")
    if (!isUpdateAllowed) {
      throw new Error("update is not possible for some fileds");
    } else {
      await User.findByIdAndUpdate(userId, data,{
        runValidators:true
      });

      res.send("user updated");
    }
  } catch (error) {
    res.status(400).send("something went wrong "+ error.message);
  }
});

connectDB()
  .then(() => {
    console.log("connection established to database");
    app.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => console.log("connection cannot established to database"));
