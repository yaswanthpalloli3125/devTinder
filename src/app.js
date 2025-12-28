const express = require("express");
const connectDB = require("./databse");
const { User } = require("./models/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authrouter");
const profileRouter = require("./routes/profileRouter");
const connectionRouter = require("./routes/connectionRouter");
const userRouter = require("./routes/userRouter");
const cors = require("cors")

const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);

app.use("/",profileRouter);

app.use("/",connectionRouter);

app.use("/",userRouter);



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



connectDB()
  .then(() => {
    console.log("connection established to database");
    app.listen(7777, () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => console.log("connection cannot established to database"));
