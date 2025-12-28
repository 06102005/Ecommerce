const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* Protect routes (logged-in users only) */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

/* Admin-only access */
const admin = (req, res, next) => {
  /*console.log("USER FROM TOKEN:", req.user);*/
  if (req.user && req.user.role=="admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = { protect, admin };


