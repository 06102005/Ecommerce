const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const guestIdMiddleware = require("./middleware/guestId");
require("dotenv").config();

const connectDB = require("./config/db");

/* ROUTES */
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const refundRoutes = require("./routes/refundRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const adminRoutes = require("./routes/adminRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const { razorpayWebhook } = require("./controllers/webhookController");

const app = express();

/* ===============================
   DATABASE
================================ */
connectDB();

/* ===============================
   CORS
================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ===============================
   PARSERS
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   GUEST ID (VERY IMPORTANT)
================================ */
app.use(guestIdMiddleware);

/* ===============================
   WEBHOOK
================================ */
app.post(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

/* ===============================
   API ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/refund", refundRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/webhooks", webhookRoutes);

/* ===============================
   STATIC
================================ */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ===============================
   HEALTH
================================ */
app.get("/", (req, res) => {
  res.send("Backend API running");
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
