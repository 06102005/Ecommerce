const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { getMonthlySales } = require("../controllers/adminController");
const {
  getAllUsers,
  deleteUser,
  toggleAdminRole
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/stats", protect, admin, getAdminStats);
router.get("/sales", protect, admin, getMonthlySales);
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.put("/users/:id/role", protect, admin, toggleAdminRole);

module.exports = router;
