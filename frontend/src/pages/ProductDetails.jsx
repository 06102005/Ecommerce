import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- Fetch Product ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ---------- Check Wishlist ---------- */
  useEffect(() => {
    if (!user?.token || !product?._id) return;

    const checkWishlist = async () => {
      const res = await fetch("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setInWishlist(data.some((p) => p._id === product._id));
      }
    };

    checkWishlist();
  }, [user, product]);

  /* ---------- Wishlist Toggle ---------- */
  const wishlistHandler = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const method = inWishlist ? "DELETE" : "POST";

    const res = await fetch("http://localhost:5000/api/wishlist", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId: product._id }),
    });

    if (res.ok) setInWishlist(!inWishlist);
  };

  /* ---------- Add to Cart ---------- */
  const addToCartHandler = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const res = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        productId: product._id,
        qty,
      }),
    });

    if (res.ok) navigate("/cart");
  };

  /* ---------- Buy Now ---------- */
  const buyNowHandler = async () => {
    await addToCartHandler();
    navigate("/checkout");
  };

  if (loading) return <h2 className="status">Loading product…</h2>;
  if (error) return <h2 className="status error">{error}</h2>;

  const stock = product.countInStock;

  return (
    <div className="product-page">
      <div className="product-card">
        {/* IMAGE WRAPPER (FIXED SIZE) */}
        <div className="image-box">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
          />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>

          <p className="description">{product.description}</p>

          <p className={`stock ${stock === 0 ? "out" : ""}`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </p>

          {stock > 0 && (
            <div className="qty-controls">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                onClick={() =>
                  setQty((q) => Math.min(stock, q + 1))
                }
              >
                +
              </button>
            </div>
          )}

          <div className="button-row">
            <button
              className="add-cart-btn"
              disabled={stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>

            <button
              className="buy-btn"
              disabled={stock === 0}
              onClick={buyNowHandler}
            >
              Buy Now
            </button>
          </div>

          <button
            className={`wishlist-btn ${inWishlist ? "active" : ""}`}
            onClick={wishlistHandler}
          >
            {inWishlist ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

