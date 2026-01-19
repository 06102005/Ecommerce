import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/checkout";
import Order from "./pages/Order";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
  <Route path="/register" element={<Register />} />
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />

  {/* Protected user route */}
  <Route
    path="/cart"
    element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    }
  />

  {/* Admin-only route */}
  <Route
    path="/admin/orders"
    element={
      <ProtectedRoute adminOnly={true}>
        <AdminOrders />
      </ProtectedRoute>
    }
  />
  <Route
  path="/admin/products"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminProducts />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminUsers/>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/product/new"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminProductForm />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/product/:id/edit"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminProductForm />
    </ProtectedRoute>
  }
/>

<Route path="/product/:id" element={<ProductDetails />} />

<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  }
/>
<Route
  path="/order/:id"
  element={
    <ProtectedRoute>
      <Order />
    </ProtectedRoute>
  }
/>

  <Route path="*" element={<NotFound />} />
</Routes>

      </Layout>
    </BrowserRouter>
  );
}

export default App;



