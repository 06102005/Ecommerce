const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Toggle admin role
 * @route   PUT /api/admin/users/:id/role
 * @access  Admin
 */
const toggleAdminRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = user.role === "admin" ? "user" : "admin";
  await user.save();

  res.json(user);
};

/* ===============================
   CREATE ADMIN
================================= */
const createAdminUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newAdmin = new User({
      email,
      password,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({
      _id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
    });

  } catch (error) {
    console.error("CREATE ADMIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  getAllUsers,
  deleteUser,
  toggleAdminRole,createAdminUser
};
