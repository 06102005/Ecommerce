const Order = require("../models/Order");
const razorpay = require("../config/razorpay");

const refundOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // 🔐 Safety checks
  if (!order.isCancelled) {
    return res.status(400).json({ message: "Order not cancelled" });
  }

  if (!order.isPaid || order.paymentMethod !== "ONLINE") {
    return res.status(400).json({ message: "Order not eligible for refund" });
  }

  if (order.isRefunded) {
    return res.status(400).json({ message: "Order already refunded" });
  }

  // 🔴 Razorpay refund
  const refund = await razorpay.payments.refund(
    order.paymentResult.id,
    {
      amount: Math.round(order.totalPrice * 100), // paise
      speed: "optimum",
    }
  );

  // ✅ Save refund info
  order.isRefunded = true;
  order.refundedAt = Date.now();
  order.refundResult = {
    id: refund.id,
    status: refund.status,
  };

  await order.save();

  res.json({
    message: "Refund initiated successfully",
    refundId: refund.id,
  });
};

module.exports = { refundOrder };

