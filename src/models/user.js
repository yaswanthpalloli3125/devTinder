const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        maxlength:18,
        minlength:4

    },
    lastName:{
        type: String,
          maxlength:18,
        minlength:4
    },
    email:{
        type:String,
        unique: true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
          const validEmail = validator.isEmail(value);
          if(!validEmail){
            throw new Error("email is not valid");
          }
        }
    },
    password:{
        type:String

    },
    age:{
        type: Number,
        min:18,
        max:90
    },
    gender:{
        type: String,
        lowercase:true,
        validate(value){
            const validGender = ["male","female","others"];
            const isValidGender = validGender.includes(value);
            console.log("2")
            if(!isValidGender){
                throw new Error("gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://pixabay.com/images/search/user%20icon/",
        validate(value){
            const validUrl = validator.isURL(value);
            if(!validUrl){
                throw new Error("photo url is not valid")
            }
        }
    }
}, {timestamps: true})

const User = mongoose.model("user",userSchema);

module.exports = {User}