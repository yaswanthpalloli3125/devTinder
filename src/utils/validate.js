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

module.exports = {validateData}