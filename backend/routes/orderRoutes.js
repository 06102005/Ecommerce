const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
} = require("../controllers/orderController");

const { cancelOrder } = require("../controllers/cancelController");
const { refundOrder } = require("../controllers/refundController");


const { protect, admin } = require("../middleware/authMiddleware");

/* ---------------- ORDERS ---------------- */
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);

/* ---------------- PAYMENT ---------------- */
router.put("/:id/pay", protect, admin, updateOrderToPaid);

/* ---------------- DELIVERY (ADMIN) ---------------- */
router.put("/:id/status", protect, admin, updateOrderStatus);

/* ---------------- CANCELLATION & REFUND ---------------- */
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/refund", protect, admin, refundOrder);



module.exports = router;



