const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleWares/auth");
const {User}  =  require("../models/user");
const {validateEditRequest} = require("../utils/validate")



profileRouter.get("/userprofile",userAuth, async (req, res) => {

  try {
      const user = req.user;
      res.send(user);
  } catch (error) {
    res.status(400).send("ERROR " + error.message);
  }
});

profileRouter.patch("/userupdate",userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const requestingToUpdateData = req.body;
  try {
    if(!validateEditRequest(requestingToUpdateData)){
        throw new Error("Update is not permitted for the data");
    }
   Object.keys(requestingToUpdateData).forEach((key) =>
      loggedInUser[key]=requestingToUpdateData[key]
    );
      await loggedInUser.save();
      res.json({message:"user updated",data:loggedInUser});
    }
   catch (error) {
    res.status(400).send("something went wrong " + error.message);
  }
});

module.exports = profileRouter;