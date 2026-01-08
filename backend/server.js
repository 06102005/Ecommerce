const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("Razorpay key loaded:", process.env.RAZORPAY_KEY_ID ? "YES" : "NO");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const Product = require("./models/Product");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes");

const { protect } = require("./middleware/authMiddleware");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhooks", webhookRoutes); 
app.use(express.json());    
     
app.get("/", (req, res) => {
  res.send("Backend API running");
});
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

