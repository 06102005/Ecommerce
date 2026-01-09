const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const { protect } = require("./middleware/authMiddleware");
const { razorpayWebhook} = require("./controllers/webhookController");

const app = express();

connectDB();

app.use(cors());

/* ✅ Razorpay webhook MUST come BEFORE express.json */
app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

/* ✅ Now enable JSON parsing for rest of app */
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

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


