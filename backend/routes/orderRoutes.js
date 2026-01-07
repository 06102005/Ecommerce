const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById, 
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, admin, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;

