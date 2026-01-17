import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
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



