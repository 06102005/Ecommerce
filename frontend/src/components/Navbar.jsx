import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <Link to="/" className="logo">
        ShopX
      </Link>

      {/* HAMBURGER */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* RIGHT */}
      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        {/* ---------- NORMAL USER ---------- */}
        {user && user.role !== "admin" && (
          <>
            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist
            </Link>

            <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
              My Orders
            </Link>

            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </Link>
          </>
        )}

        {/* ---------- ADMIN ---------- */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
          </>
        )}

        {/* ---------- AUTH ---------- */}
        {user ? (
          <button onClick={logoutHandler} className="logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
