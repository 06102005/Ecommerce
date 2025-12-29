const mongoose = require("mongoose");
const Order = require("../models/Order");

// @desc   Create new order
// @route  POST /api/orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // ✅ ADD THIS BLOCK
    for (let item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("ORDER ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// @desc   Get logged-in user's orders
// @route  GET /api/orders/myorders
// @access Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc   Get all orders (Admin)
// @route  GET /api/orders
// @access Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
};
