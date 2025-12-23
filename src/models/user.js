const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

userSchema.methods.passwordValidation = async function(userProvidedPassword){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(userProvidedPassword,passwordHash);
    return isPasswordValid;
}

userSchema.methods.getToken = async function(){
     const user = this;
     const token = await jwt.sign({id:user.id},"devtinder@123",{expiresIn:"7d"});
     return token;
}



const User = mongoose.model("user",userSchema);

module.exports = {User}