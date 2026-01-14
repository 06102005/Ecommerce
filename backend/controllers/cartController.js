const User = require("../models/User");

/* ADD TO CART */
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cartItems) {
      user.cartItems = [];
    }

    const itemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cartItems[itemIndex].qty += qty;
    } else {
      user.cartItems.push({ product: productId, qty });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate("cartItems.product");

    res.status(201).json(updatedUser.cartItems);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};


/* GET CART */
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("cartItems.product");

  res.json(user.cartItems);
};

/* REMOVE FROM CART */
const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate("cartItems.product");

  res.json(updatedUser.cartItems);
};

/* UPDATE CART ITEM QTY */
const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  const user = await User.findById(req.user._id);

  const item = user.cartItems.find(
    (i) => i.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.qty = qty;

  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate("cartItems.product");

  res.json(updatedUser.cartItems);
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
};

