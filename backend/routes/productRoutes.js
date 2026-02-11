const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"), // image OPTIONAL
  updateProduct
);
router.delete("/:id", protect, admin, deleteProduct);

console.log("UPLOAD:", upload);


module.exports = router;



