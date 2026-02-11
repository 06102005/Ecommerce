import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

/* ---------- PUBLIC (NO LOGIN REQUIRED) ---------- */
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";
import Order from "./pages/Order";
import ProductDetails from "./pages/ProductDetails";

/* ---------- ADMIN ---------- */
import Login from "./pages/Login";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrdersDone from "./pages/AdminOrdersDone";
import AdminProductForm from "./pages/AdminProductForm";

/* ---------- ADMIN PROTECTION ---------- */
import ProtectedRoute from "./components/ProtectedRoute";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* ================= ADMIN LOGIN ================= */}
          <Route path="/login" element={<Login />} />

          {/* ================= ADMIN PROTECTED ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders/done"
            element={
              <ProtectedRoute>
                <AdminOrdersDone />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/new"
            element={
              <ProtectedRoute>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/product/:id/edit"
            element={
              <ProtectedRoute>
                <AdminProductForm />
              </ProtectedRoute>
            }
          />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
