const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/checkout", async (req, res) => {
  const order = new Order({
    items: [],
    total: 0
  });

  await order.save();
  res.json({ message: "Payment success" });
});

module.exports = router;
