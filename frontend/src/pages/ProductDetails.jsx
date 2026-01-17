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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    try {
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Add to cart failed");
      }

      navigate("/cart");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  const stock = product.countInStock;

  const stockText =
    stock > 15
      ? "In stock"
      : stock > 0
      ? `${stock} left in stock`
      : "Out of stock";

  return (
    <div className="product-container">
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h1>{product.name}</h1>
        <h2>₹{product.price}</h2>

        <p className="description">{product.description}</p>

        <p className={`stock ${stock === 0 ? "out" : ""}`}>
          {stockText}
        </p>

        {stock > 0 && (
          <div className="qty-controls">
            <button
              onClick={() => setQty(qty - 1)}
              disabled={qty <= 1}
            >
              −
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQty(qty + 1)}
              disabled={qty >= stock}
            >
              +
            </button>
          </div>
        )}

        <button
          className="add-cart-btn"
          disabled={stock === 0}
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;




