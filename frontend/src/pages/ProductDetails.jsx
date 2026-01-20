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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  /* ---------- FETCH PRODUCT ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
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

  /* ---------- CHECK WISHLIST ---------- */
  useEffect(() => {
    if (!user?.token) return;

    const checkWishlist = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setWishlisted(data.some((p) => p._id === id));
      } catch {}
    };

    checkWishlist();
  }, [id, user]);

  /* ---------- WISHLIST ---------- */
  const toggleWishlist = async () => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    const url = `http://localhost:5000/api/wishlist/${product._id}`;

    const res = await fetch(url, {
      method: wishlisted ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    if (res.ok) setWishlisted(!wishlisted);
  };

  /* ---------- CART ---------- */
  const addToCartHandler = async () => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ productId: product._id, qty }),
    });

    navigate("/cart");
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return null;

  const stockText =
    product.countInStock > 0
      ? `${product.countInStock} in stock`
      : "Out of stock";

  return (
    <div className="product-page">
      <div className="product-card">
        {/* IMAGE */}
        <div className="image-container">
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            className="product-image"
          />
        </div>

        {/* HEART BELOW IMAGE */}
        <div className="wishlist-row">
          <button
            className={`wishlist-heart ${wishlisted ? "active" : ""}`}
            onClick={toggleWishlist}
          >
            ♥
          </button>
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <h2>₹{product.price}</h2>

          <p className="description">{product.description}</p>

          <p
            className={`stock ${
              product.countInStock === 0 ? "out" : "in"
            }`}
          >
            {stockText}
          </p>

          {product.countInStock > 0 && (
            <div className="qty-controls">
              <button onClick={() => setQty(qty - 1)} disabled={qty <= 1}>
                −
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                disabled={qty >= product.countInStock}
              >
                +
              </button>
            </div>
          )}

          <div className="button-row">
            <button
              className="add-cart-btn"
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>

            <button
              className="buy-btn"
              disabled={product.countInStock === 0}
              onClick={() => navigate("/checkout")}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;



