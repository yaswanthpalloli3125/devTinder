const mongoose = require("mongoose");
const {User} = require("../models/user")

const connectionRequestSchema = new mongoose.Schema({
    fromUserID:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"user"
    },
    toUserID:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"user"
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","rejected","accepted","pending"],
            message:`{VALUE} is not valid status`,
        }
    }
},{timestamps:true})

//compound indexes

connectionRequestSchema.index({fromUserID:1,toUserID:1})  //1 ascending -1 descending

/* connectionRequestSchema.pre("save",function(next){
   const connectionRequest = this;
  if(connectionRequest.fromUserID.equals(connectionRequest.toUserID)){
          
         throw new Error("you cannot send request to yourself")
    }

    next();
   
}) */

const ConnectionRequestModel = new mongoose.model("connectionRequestModel", connectionRequestSchema);

module.exports = ConnectionRequestModel;