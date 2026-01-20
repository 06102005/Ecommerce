const mongoose = require("mongoose");
const Order = require("../models/Order");
const razorpay = require("../config/razorpay");
const Product = require("../models/Product");
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

    if (!paymentMethod || !["COD", "Razorpay"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid or missing payment method",
      });
    }

    // ✅ Build proper order items (snapshot)
    const processedOrderItems = [];

    for (let item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      processedOrderItems.push({
        name: product.name,
        image: product.image,        // ✅ FIXED
        price: product.price,
        qty: item.qty,
        product: product._id,
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: processedOrderItems, // ✅ USE THIS
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder };




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
  try {
    const filter = {};

    if (req.query.paid === "true") filter.isPaid = true;
    if (req.query.paid === "false") filter.isPaid = false;

    if (req.query.delivered === "true") filter.isDelivered = true;
    if (req.query.delivered === "false") filter.isDelivered = false;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update order to paid
// @route  PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save({ validateBeforeSave: false });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save({ validateBeforeSave: false });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
    )
    .populate("orderItems.product", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
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
};
