const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE ORDER
router.post("/create", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentStatus: "Pending"
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error.message
    });
  }
});

module.exports = router;
