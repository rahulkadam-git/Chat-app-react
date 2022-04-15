const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
let SECRET_KEY = `75ZM.w]R++gGE&sf5,8gzr526FBu?<Wvp:qXuV$Gm6>"md3q"c`;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      

      const decoded = jwt.verify(token, SECRET_KEY);
     
      req.user = await User.findById(decoded._id).select("-password");

      next();
    } catch (error) {
      res.status(401).json("Not authorized,token failed");
    }
  }

  if (!token) {
    res.status(401).json("not authorized,no token");
  }
};

module.exports = { protect };
