import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/wishlist")
      .then(res => res.json())
      .then(setWishlist);
  }, []);

  const removeFromWishlist = async (id) => {
    await fetch(`http://localhost:5000/api/wishlist/${id}`, {
      method: "DELETE",
    });

    setWishlist(prev => prev.filter(p => p._id !== id));
  };

  const addToCart = async (productId) => {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty: 1 }),
    });

    navigate("/cart");
  };

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>Wishlist empty</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product._id} className="wishlist-card">
              <Link to={`/product/${product._id}`}>
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                />
              </Link>

              <h3>{product.name}</h3>
              <p>₹{product.price}</p>

              <button onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>

              <button onClick={() => removeFromWishlist(product._id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
