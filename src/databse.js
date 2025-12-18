const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://palloliyaswanth_Mongo:HUSKRQdIi4JMS7Cr@yash3125.apdxy38.mongodb.net/devTinder");
}

module.exports = connectDB;
