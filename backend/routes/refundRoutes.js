const express = require("express");
const router = express.Router();

const { refundOrder } = require("../controllers/refundController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/:orderId", protect, admin, refundOrder);

module.exports = router;
