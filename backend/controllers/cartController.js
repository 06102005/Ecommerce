const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

/* =================================================
   Helper → decide owner (user OR guest)
================================================= */
const getCartOwner = async (req, res) => {
  /* ---------- USER (admin logged in) ---------- */
  if (req.user) {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    return cart;
  }

  /* ---------- GUEST ---------- */
  let guestId = req.cookies.guestId;

  if (!guestId) {
    guestId = uuidv4();

    res.cookie("guestId", guestId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    });
  }

  let cart = await Cart.findOne({ guestId });

  if (!cart) {
    cart = await Cart.create({
      guestId,
      items: []
    });
  }

  return cart;
};


/* =================================================
   ADD TO CART
================================================= */
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await getCartOwner(req, res);

    const existing = cart.items.find(
      i => i.product.toString() === productId
    );

    if (existing) existing.qty += qty;
    else cart.items.push({ product: productId, qty });

    await cart.save();

    await cart.populate("items.product");

    res.status(201).json(cart.items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};


/* =================================================
   GET CART
================================================= */
const getCart = async (req, res) => {
  try {
    const cart = await getCartOwner(req, res);

    await cart.populate("items.product");

    res.json(cart.items);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};


/* =================================================
   REMOVE ITEM
================================================= */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await getCartOwner(req, res);

    cart.items = cart.items.filter(
      i => i.product.toString() !== productId
    );

    await cart.save();

    await cart.populate("items.product");

    res.json(cart.items);

  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};


/* =================================================
   UPDATE QTY
================================================= */
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    const cart = await getCartOwner(req, res);

    const item = cart.items.find(
      i => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.qty = qty;

    await cart.save();

    await cart.populate("items.product");

    res.json(cart.items);

  } catch (err) {
    res.status(500).json({ message: "Failed to update qty" });
  }
};


/* =================================================
   CLEAR CART
================================================= */
const clearCart = async (req, res) => {
  try {
    const cart = await getCartOwner(req, res);

    cart.items = [];

    await cart.save();

    res.json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};


module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart
};
