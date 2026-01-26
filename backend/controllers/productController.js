const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    // 🔍 Keyword search (name + description)
    const keyword = req.query.keyword
      ? {
          $text: { $search: req.query.keyword },
        }
      : {};

    // 🗂 Category filter
    const category = req.query.category
      ? { category: req.query.category }
      : {};

    // 💰 Price filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice)
        priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // 🔗 Merge all filters
    const filter = {
      ...keyword,
      ...category,
      ...priceFilter,
    };

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* CREATE product (ADMIN ONLY) */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      countInStock,
      shippingCost,
    } = req.body;

    // 🔐 Validate image upload
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      countInStock: req.body.countInStock,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image ,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};


/* UPDATE product (ADMIN ONLY) */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Text fields
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.countInStock =
      req.body.countInStock !== undefined
        ? req.body.countInStock
        : product.countInStock;

    // 🖼 Image update (ONLY if new image uploaded)
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    console.log("product updated");

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* DELETE product (ADMIN ONLY) */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Delete image file safely
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};

