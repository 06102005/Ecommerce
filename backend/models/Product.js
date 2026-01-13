const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
  type: String,
  required: true,
  },
    category: {
      type: String,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
productSchema.index({
  name: "text",
  description: "text",
});

module.exports = mongoose.model("Product", productSchema);

