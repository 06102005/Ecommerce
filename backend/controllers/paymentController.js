const razorpay = require("../config/razorpay");

// @desc   Create Razorpay order
// @route  POST /api/payment/create
// @access Private
const createPaymentOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder };
