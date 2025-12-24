const express = require("express");
const { userAuth } = require("../middleWares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
 
const USER_SAFE_DATA = "firstName lastName age gender"

userRouter.get("/user/connections/received",userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserID: loggedInUser._id,
            status:"interested"
        }).populate("fromUserID",USER_SAFE_DATA);
        if(!pendingRequests){
            res.status(400).json({
                message:"something went wrong"
            })
        }
        if(pendingRequests.length===0){
            return res.json({message:"no pending requests"})
        }
        res.send(pendingRequests);
    } catch (error) {
        res.status(400).send("ERROR "+ error.message)
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try {
         const loggedInUser = req.user;
         const connections = await ConnectionRequest.find({
            $or:[{fromUserID: loggedInUser._id,status:"accepted"},{toUserID: loggedInUser._id,status:"accepted"}]
         }).populate("fromUserID",USER_SAFE_DATA).populate("toUserID",USER_SAFE_DATA);

         const data = connections.map(row=>{
            if(row.fromUserID._id.toString()===loggedInUser._id.toString()){
                return row.toUserID;
            }
            return row.fromUserID;
         });

         res.json(data);
    } catch (error) {
        res.status(400).send("ERROR "+ error.message);
    }
})

module.exports = userRouter;
