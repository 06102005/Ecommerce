const Order = require("../models/Order");

// @desc   Cancel order
// @route  PUT /api/orders/:id/cancel
// @access Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ Already cancelled
    if (order.isCancelled) {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    // ❌ Delivered orders cannot be cancelled
    if (order.isDelivered) {
      return res.status(400).json({
        message: "Delivered orders cannot be cancelled",
      });
    }

    // 🔐 User can cancel only their order
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();
    order.cancelReason = req.body.reason || "User cancelled";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error("CANCEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { cancelOrder };
