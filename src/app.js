const express = require("express");
const connectDB = require("./databse");
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authrouter");
const profileRouter = require("./routes/profileRouter");
const connectionRouter = require("./routes/connectionRouter")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);

app.use("/",profileRouter);

app.use("/",connectionRouter);

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
    const allowedDataToUpdate = ["age", "gender", "photoUrl"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedDataToUpdate.includes(k)
    );
    console.log("1");
    if (!isUpdateAllowed) {
      throw new Error("update is not possible for some fileds");
    } else {
      await User.findByIdAndUpdate(userId, data, {
        runValidators: true,
      });

      res.send("user updated");
    }
  } catch (error) {
    res.status(400).send("something went wrong " + error.message);
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
