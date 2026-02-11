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
    orderItems: [orderItemSchema],

    /* CUSTOMER INFO */
    shippingAddress: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    /* PAYMENT */
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    /* STATUS */
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },

    shippedAt: Date,

    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,

  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
