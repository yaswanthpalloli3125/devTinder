const express = require("express");
const connectionRouter  = express.Router();
const {userAuth} = require("../middleWares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const sendEmail = require("../utils/sendEmail");

connectionRouter.post("/connectionrequest/:status/:touserid",userAuth, async(req,res)=>{
    
  try {
   
    const fromUserID = req.user._id;
    const toUserID = req.params.touserid;
    const status = req.params.status;
    const validStatus = ["interested","ignored"];
    const isStatusValid = validStatus.includes(status);
   
    if(!isStatusValid){
       return res.status(400).json({message:"invalid status type " + status})
    }
     if(fromUserID.equals(toUserID)){
          
          return res.status(404).json({message:"you cannot send request to yourself"})
        } 

    const toUser = await User.findById(toUserID);
    if(!toUser){
      return res.status(404).json({message:"touser not found"})
    }
     
    const existConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        {fromUserID,toUserID},
        {fromUserID:toUserID,toUserID:fromUserID}
      ]
    })
    if(existConnectionRequest){
      return res.status(400).json({message:"connetion already exist"})
    }



    const newConnectionRequest = new ConnectionRequest({
      fromUserID,
      toUserID,
      status
     })

     const data = await newConnectionRequest.save();

     const emailRes = await sendEmail.run();
     console.log(emailRes);

    res.json({
      message:"connection sent successfuly",
      data,
      emailRes
    })
     
  } catch (error) {
    res.status(400).send("ERROR "+ error.message)
  }
})

connectionRouter.post("/connectionrequest/review/:status/:requestid",userAuth, async (req,res)=>{
    try {
      const loggedInUser= req.user;
      const {status,requestid} = req.params;
      const validStatus = ["accepted","rejected"];
      const isValidStatus = validStatus.includes(status);

      if(!isValidStatus){
       return res.status(400).json({message:"invalid status type"});
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestid,
        toUserID: loggedInUser._id,
        status: "interested"
     

      })
      if(!connectionRequest){
        return res.status(401).json({message:"request not found"})
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({message:"connection request "+ status},data);
      
    } catch (error) {
      res.status(400).send("ERROR " + error.message)
    }
})





module.exports = connectionRouter;