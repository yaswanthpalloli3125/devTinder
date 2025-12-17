const adminAuth = (req,res,next)=>{
   const token = "xyz";
   console.log("authorization of admin checking");
   const isAdminAuthorized = token === "xyz";
   if(!isAdminAuthorized){
    res.status(401).send("unAuthorized");
   }else{
    next();
   }
}

const userAuth = (req,res,next)=>{
   const token = "xyz";
   console.log("authorization of user checking")
   const isAdminAuthorized = token === "xyz";
   if(!isAdminAuthorized){
    res.status(401).send("unAuthorized");
   }else{
    next();
   }
}

module.exports = {
    adminAuth,
    userAuth
}