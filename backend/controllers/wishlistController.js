const Product = require("../models/Product");

/* ===============================
   GET WISHLIST
================================ */
const getWishlist = async (req, res) => {
  if (!req.session.wishlist) req.session.wishlist = [];

  const populated = await Promise.all(
    req.session.wishlist.map((id) => Product.findById(id))
  );

  res.json(populated);
};


/* ===============================
   ADD
================================ */
const addToWishlist = (req, res) => {
  const { productId } = req.params;

  if (!req.session.wishlist) req.session.wishlist = [];

  if (!req.session.wishlist.includes(productId)) {
    req.session.wishlist.push(productId);
  }

  res.json(req.session.wishlist);
};


/* ===============================
   REMOVE
================================ */
const removeFromWishlist = (req, res) => {
  const { productId } = req.params;

  req.session.wishlist = (req.session.wishlist || []).filter(
    (id) => id !== productId
  );

  res.json(req.session.wishlist);
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
