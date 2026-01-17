const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const createPaymentOrder = async (req, res) => {
  try {
    console.log("Payment request body:", req.body);

    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: `order_${orderId}`,
    };

    console.log("Creating Razorpay order...");

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order);

    res.status(201).json(order);
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ message: error.message });
  }
};



// @desc   Verify Razorpay payment
// @route  POST /api/payment/verify
// @access Private
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId, // your MongoDB Order _id
  } = req.body;

  // Step 1: Create expected signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  // Step 2: Compare signatures
  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // Step 3: Update order
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: razorpay_payment_id,
    status: "success",
  };

  await order.save();

  res.json({ message: "Payment verified successfully" });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
