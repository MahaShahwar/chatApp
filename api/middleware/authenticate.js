const jwt = require("jsonwebtoken");
const User = require("../src/models/user");

const auth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ){
    try {
      //verifying its actual token of current user
      token = req.headers.authorization.split(" ")[1]
      
      const decoded = jwt.verify(token, "this is secret key");
      //this variable can be accessed anywhere
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
}else{
      res.status(401).send("Not authorized, no token");
}


}
module.exports = { auth };