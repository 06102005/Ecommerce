const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} = require("../controllers/cartController");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);

/* ✅ CLEAR CART — FIXED */
router.delete("/clear", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.cartItems = [];
  await user.save();

  res.json({ message: "Cart cleared" });
});

router.put("/:productId", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
