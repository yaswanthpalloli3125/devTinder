const express = require("express");
const { userAuth } = require("../middleWares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
 
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
        res.json({data:pendingRequests});
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

         res.json({data:data});
    } catch (error) {
        res.status(400).send("ERROR "+ error.message);
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) ||1;
        let limit = parseInt(req.query.limit)||10;
        limit = limit>50?50:limit;
        const skip = (page-1)*limit;

        const userConnections = await ConnectionRequest.find({
            $or:[{fromUserID:loggedInUser._id},{toUserID:loggedInUser._id}]
        }).select("fromUserID toUserID");

        const hideUsersList = new Set();
         
        userConnections.forEach(req => {
            hideUsersList.add(req.fromUserID.toString());
            hideUsersList.add(req.toUserID.toString());
        });

        const feedList = await User.find({
           $and:[{_id: {$nin: Array.from(hideUsersList)}},{_id:{$ne:loggedInUser._id}}]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

           res.json({data:feedList})
        
    } catch (error) {
         res.status(400).send("ERROR "+ error.message);
    }
})

module.exports = userRouter;
