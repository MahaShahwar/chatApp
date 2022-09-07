const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateToken = (id) => {
  const token= jwt.sign({ id }, process.env.jwtSecretKey, {
    expiresIn: "30d",
  });
  return token
};

module.exports = generateToken;