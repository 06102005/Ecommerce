import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ---------------- Fetch Badge Counts ---------------- */
  useEffect(() => {
    if (!user?.token) {
      setWishlistCount(0);
      setOrderCount(0);
      return;
    }

    const fetchCounts = async () => {
      try {
        const wishlistRes = await fetch(
          "http://localhost:5000/api/wishlist",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          setWishlistCount(wishlistData.length || 0);
        }

        const ordersRes = await fetch(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrderCount(ordersData.length || 0);
        }
      } catch (err) {
        console.error("Navbar badge error:", err.message);
      }
    };

    fetchCounts();
  }, [user]);

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

        {user && (
          <>
            <Link
              to="/wishlist"
              className="badge-link"
              onClick={() => setMenuOpen(false)}
            >
              Wishlist
              {wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/my-orders"
              className="badge-link"
              onClick={() => setMenuOpen(false)}
            >
              My Orders
              {orderCount > 0 && (
                <span className="badge">{orderCount}</span>
              )}
            </Link>

            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
          </>
        )}

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







