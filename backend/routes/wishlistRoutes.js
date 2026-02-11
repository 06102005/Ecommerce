const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

/* NO AUTH */

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
