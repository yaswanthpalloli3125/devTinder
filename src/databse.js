const mongoose = require("mongoose");

const connectDB = async ()=>{
    
    await mongoose.connect(process.env.MONGODB_SECRET);
}

module.exports = connectDB;
