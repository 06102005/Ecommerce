const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cartController");

/* NO PROTECT ANYMORE */

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/clear", clearCart);
router.put("/:productId", updateCartItem);
router.delete("/:productId", removeFromCart);

module.exports = router;
