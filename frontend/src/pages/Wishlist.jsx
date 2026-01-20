import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- Fetch Wishlist ---------------- */
  const fetchWishlist = async () => {
    if (!user?.token) return;

    try {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load wishlist");

      setWishlist(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  /* ---------------- Remove ---------------- */
  const removeFromWishlist = async (id) => {
    await fetch(`http://localhost:5000/api/wishlist/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    setWishlist((prev) => prev.filter((p) => p._id !== id));
  };

  /* ---------------- Add to Cart ---------------- */
  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item._id === product._id);
    if (!exists) {
      cart.push({ ...product, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    navigate("/cart");
  };

  /* ---------------- Guards ---------------- */
  if (!user) return <h2 className="status-text">Please login</h2>;
  if (loading) return <h2 className="status-text">Loading wishlist...</h2>;
  if (error) return <h2 className="status-text error">{error}</h2>;

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty 💔</p>
          <Link to="/" className="shop-link">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-card">
              <Link to={`/product/${product._id}`}>
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                />
              </Link>

              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>

              <div className="wishlist-actions">
                <button
                  className="add-cart"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

                <button
                  className="remove"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

