const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =================================
   PROTECT (admin only now)
================================= */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await User.findById(decoded.id).select("-password");

      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
      }

      req.user = admin;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};

/* dummy admin middleware (optional, keeps routes unchanged) */
const admin = (req, res, next) => next();

module.exports = { protect, admin };
