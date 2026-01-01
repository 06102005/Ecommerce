const User = require("../models/User");

// @desc   Add item to cart
// @route  POST /api/cart
// @access Private
const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  const user = await User.findById(req.user._id);

  const itemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Product already in cart → update qty
    user.cartItems[itemIndex].qty += qty;
  } else {
    // New product
    user.cartItems.push({ product: productId, qty });
  }

  await user.save();
  res.json(user.cartItems);
};

// @desc   Get cart
// @route  GET /api/cart
// @access Private
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "cartItems.product",
    "name price"
  );

  res.json(user.cartItems);
};

// @desc   Remove item from cart
// @route  DELETE /api/cart/:productId
// @access Private
const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await user.save();
  res.json(user.cartItems);
};

module.exports = { addToCart, getCart, removeFromCart };
