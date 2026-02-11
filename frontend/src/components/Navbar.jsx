import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(
    !!localStorage.getItem("adminToken")
  );

  /* =================================
     LISTEN FOR TOKEN CHANGES
  ================================= */
  useEffect(() => {
    const checkToken = () => {
      setAdmin(!!localStorage.getItem("adminToken"));
    };

    // fires when storage changes
    window.addEventListener("storage", checkToken);

    // also run immediately (important)
    checkToken();

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  /* =================================
     LOGOUT
  ================================= */
  const logoutHandler = () => {
    localStorage.removeItem("adminToken");
    setAdmin(false); // instant UI update
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopX</Link>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        
        {/* ALWAYS */}
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>

        {/* ===============================
           USER ONLY LINKS
        =============================== */}
        {!admin && (
          <>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/login">Admin</Link>
          </>
        )}

        {/* ===============================
           ADMIN ONLY LINKS
        =============================== */}
        {admin && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>

            <button onClick={logoutHandler} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
