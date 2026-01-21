const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },

    totalPrice: { type: Number, required: true },

    /* ---------------- PAYMENT ---------------- */
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    /* ---------------- DELIVERY STATUS (NEW) ---------------- */
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },

    shippedAt: Date,

    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,

    /* ---------------- CANCELLATION ---------------- */
    isCancelled: { type: Boolean, default: false },
    cancelledAt: Date,
    cancelReason: String,

    /* ---------------- REFUND ---------------- */
    isRefunded: { type: Boolean, default: false },
    refundedAt: Date,

    refundResult: {
      id: String,
      status: String,
    },

    refundStatus: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

