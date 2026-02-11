const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");


/* =================================
   CREATE ORDER (GUEST BASED — NO SESSION)
================================= */
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const processedOrderItems = [];

    /* ---------------- PROCESS ITEMS ---------------- */
    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      /* stock check */
      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      product.stock -= item.qty;
      await product.save();

      processedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      });
    }

    /* ---------------- CREATE ORDER ---------------- */
    const order = await Order.create({
      orderItems: processedOrderItems,
      shippingAddress,
      totalPrice,
      orderStatus: "Pending",
    });

    res.status(201).json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* =================================
   GET MY ORDERS
================================= */
const getMyOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
};


/* =================================
   ADMIN — GET ALL
================================= */
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
};


/* =================================
   GET SINGLE
================================= */
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};


/* =================================
   MARK PAID
================================= */
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save({ validateBeforeSave: false });

  res.json(updatedOrder);
};


/* =================================
   UPDATE STATUS
================================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === "Shipped") order.shippedAt = new Date();
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =================================
   DELETE
================================= */
const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).json({ message: "Order not found" });

  await order.deleteOne();

  res.json({ message: "Order deleted" });
};


module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  deleteOrder,
};
