const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
} = require("../controllers/orderController");

const { cancelOrder } = require("../controllers/cancelController");

const { refundOrder } = require("../controllers/refundController");

const { protect, admin } = require("../middleware/authMiddleware");

// Orders
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, admin, getOrderById);

// Payment & delivery
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

// Cancellation & refund
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/refund", protect, admin, refundOrder);

module.exports = router;


