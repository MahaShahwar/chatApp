const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const token= jwt.sign({ id }, "this is secret key", {
    expiresIn: "30d",
  });
  return token
};

module.exports = generateToken;