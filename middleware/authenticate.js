const jwt = require("jsonwebtoken");
const User = require("../src/models/signup");

const auth = async (req, res, next) => {
  const token = req.cookies["Token"] 
  if (!token) {
    res.send('User not Valid')
  }
    try {
      //verifying its actual token of current user
      
      const decoded = jwt.verify(token, "this is secret key");
      //this variable can be accessed anywhere
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
}

module.exports = { auth };