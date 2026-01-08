const crypto = require("crypto");
const Order = require("../models/Order");

const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(req.body);
  const digest = shasum.digest("hex");

  const razorpaySignature = req.headers["x-razorpay-signature"];

  // 1️⃣ Verify signature
  if (digest !== razorpaySignature) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const event = JSON.parse(req.body.toString());

  // 2️⃣ Handle payment success
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    // You must have stored razorpay_order_id in your Order
    const order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: payment.id,
        status: payment.status,
        method: payment.method,
      };

      await order.save();
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { razorpayWebhook };

