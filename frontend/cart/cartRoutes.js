const express = require("express");
const router = express.Router();

let cart = [];

router.post("/add", (req, res) => {
  const product = req.body;
  const found = cart.find(i => i.id === product.id);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  res.json(cart);
});

router.get("/", (req, res) => {
  res.json(cart);
});

router.post("/clear", (req, res) => {
  cart = [];
  res.json({ message: "Cart cleared" });
});

module.exports = router;
const express = require("express");
const app = express();
const cartRoutes = require("./frontend/cart/cartRoutes");   
app.use("/api/cart", cartRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
    