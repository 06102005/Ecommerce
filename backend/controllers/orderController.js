const mongoose = require("mongoose");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");

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

// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
// @desc   Get order by ID (Admin)
// @route  GET /api/orders/:id
// @access Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel order (User or Admin)
// @route  PUT /api/orders/:id/cancel
// @access Private
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Prevent cancelling delivered orders
  if (order.isDelivered) {
    return res
      .status(400)
      .json({ message: "Delivered orders cannot be cancelled" });
  }

  // User can cancel only their own order
  if (
    req.user.role !== "admin" &&
    order.user.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized to cancel this order" });
  }

  order.isCancelled = true;
  order.cancelledAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

// @desc   Refund order (Admin only)
// @route  PUT /api/orders/:id/refund
// @access Admin
const refundOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.isPaid) {
      return res.status(400).json({ message: "Order not paid" });
    }

    if (order.paymentMethod === "COD") {
      return res.status(400).json({ message: "COD orders cannot be refunded" });
    }

    if (order.isRefunded) {
      return res.status(400).json({ message: "Order already refunded" });
    }

    if (!order.paymentResult || !order.paymentResult.id) {
      return res.status(400).json({ message: "Payment ID missing" });
    }

    // 🔹 Razorpay refund call
    const refund = await razorpay.payments.refund(
      order.paymentResult.id,
      {
        amount: order.totalPrice * 100, // paise
      }
    );

    // 🔹 Save refund info
    order.isRefunded = true;
    order.refundedAt = Date.now();
    order.refundId = refund.id;

    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  refundOrder,
};
