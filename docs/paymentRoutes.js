const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// UPDATE PAYMENT STATUS
router.post("/update", async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = status; // Paid / Failed
    await order.save();

    res.json({
      message: "Payment status updated",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Payment update failed",
      error: error.message
    });
  }
});

module.exports = router;
