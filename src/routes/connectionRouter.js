const express = require("express");
const connectionRouter  = express.Router();
const {userAuth} = require("../middleWares/auth");

connectionRouter.post("/connectionrequest",userAuth, async(req,res)=>{
    
  try {
    res.send("connection sent successfully")
  } catch (error) {
    res.status(400).send("ERROR "+ error.message)
  }
})

module.exports = connectionRouter;