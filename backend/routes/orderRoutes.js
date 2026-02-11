const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const { admin, protect } = require("../middleware/authMiddleware");

const { cancelOrder } = require("../controllers/cancelController");
const { refundOrder } = require("../controllers/refundController");


/* =========================
   GUEST ROUTES
========================= */
router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.get("/:id", getOrderById);

/* =========================
   ADMIN ONLY
========================= */
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, admin, getOrderById);
router.put("/:id/pay", protect, admin, updateOrderToPaid);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/refund", protect, admin, refundOrder);


module.exports = router;
