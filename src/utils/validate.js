const validator = require("validator");

const validateData = (data) => {
  const { firstName, lastName, password, email } = data;
  if (!firstName || !lastName) {
    throw new Error("enter valid firstName or lastName");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(" enter strong password");
  }
};

const validateEditRequest = (req)=>{
    if (Object.keys(req).length === 0) return false; // Reject empty updates
    
    const allowedDataToUpdate = ["age", "gender", "photoUrl"];
    return Object.keys(req).every(field => allowedDataToUpdate.includes(field));
}

module.exports = {validateData,validateEditRequest};