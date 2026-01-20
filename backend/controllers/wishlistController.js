const User = require("../models/User");

/* Get Wishlist */
const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.json(user.wishlist || []);
};

/* Add to Wishlist */
const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }

  res.json(user.wishlist);
};

/* Remove from Wishlist */
const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== req.params.productId
  );

  await user.save();
  res.json(user.wishlist);
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};

