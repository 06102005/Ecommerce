const express = require("express");
const router = express.Router();

// TEMP cart storage (later DB)
let cart = [];

/* ---------------- ADD TO CART ---------------- */
router.post("/add", (req, res) => {
  const product = req.body;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  res.json({ message: "Product added to cart", cart });
});

/* ---------------- GET CART ---------------- */
router.get("/", (req, res) => {
  res.json(cart);
});

/* ---------------- REMOVE FROM CART ---------------- */
router.post("/remove", (req, res) => {
  const { id } = req.body;
  cart = cart.filter(item => item.id !== id);
  res.json({ message: "Item removed", cart });
});

/* ---------------- CLEAR CART ---------------- */
router.post("/clear", (req, res) => {
  cart = [];
  res.json({ message: "Cart cleared" });
});

module.exports = router;
