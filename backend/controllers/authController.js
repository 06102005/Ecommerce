const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =============================
   ADMIN LOGIN ONLY
============================= */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // extra safety
    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can access" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: admin._id,
      email: admin.email,
      role: "admin",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin };
