const crypto = require("crypto");
const Order = require("../models/Order");

const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // 1️⃣ Verify signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(req.body);
  const digest = shasum.digest("hex");

  const razorpaySignature = req.headers["x-razorpay-signature"];

  if (digest !== razorpaySignature) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  // 2️⃣ Parse event
  const event = JSON.parse(req.body.toString());

  /* ================= PAYMENT CAPTURED ================= */
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentMethod = "ONLINE";
      order.paymentResult = {
        id: payment.id,
        status: payment.status,
        method: payment.method,
      };

      await order.save();
    }
  }

  /* ================= REFUND PROCESSED ================= */
  if (event.event === "refund.processed") {
  const refund = event.payload.refund.entity;

  const order = await Order.findOne({
    "paymentResult.id": refund.payment_id,
  });

  if (order) {
    order.isRefunded = true;
    order.refundedAt = Date.now();
    order.refundResult = {
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
    };

    await order.save();
  }
}

  /* ================= REFUND FAILED ================= */
  if (event.event === "refund.failed") {
    const refund = event.payload.refund.entity;

    const order = await Order.findOne({
      "refundResult.id": refund.id,
    });

    if (order) {
      order.refundStatus = "failed";
      await order.save();
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { razorpayWebhook };


