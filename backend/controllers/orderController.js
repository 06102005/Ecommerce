const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

/* ---------------- CREATE ORDER ---------------- */
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!["COD", "Razorpay"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const processedOrderItems = [];

    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      processedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name image");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save({ validateBeforeSave: false });
  res.json(updatedOrder);
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isCancelled) {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated",
      });
    }

    const allowedTransitions = {
      Pending: ["Processing"],
      Processing: ["Shipped"],
      Shipped: ["Delivered"],
      Delivered: [],
    };

    if (!allowedTransitions[order.orderStatus].includes(status)) {
      return res.status(400).json({
        message: `Invalid transition from ${order.orderStatus} to ${status}`,
      });
    }

    order.orderStatus = status;

    if (status === "Shipped") {
      order.shippedAt = new Date();
    }

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();
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
  updateOrderStatus,
};

