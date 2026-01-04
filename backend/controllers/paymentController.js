const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
  try {
    console.log("Payment request body:", req.body);

    const options = {
      amount: Number(req.body.amount) * 100,
      currency: "INR",
      receipt: "receipt_test_123",
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

module.exports = { createPaymentOrder };

