import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // 🔹 Stock display logic
  const getStockText = () => {
    if (product.countInStock === 0) return "Out of stock";
    if (product.countInStock > 15) return "In stock";
    return ` Only ${product.countInStock} left !`;
  };

  // 🔹 Quantity controls
  const increaseQty = () => {
    if (qty < product.countInStock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const addToCartHandler = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user || !user.token) {
        navigate("/cart");
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Add to cart failed");
      }

      alert("Product added to cart");
      navigate("/cart");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={{ display: "flex", gap: "40px", padding: "20px" }}>
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        style={{ width: "400px", height: "500px", objectFit: "cover" }}
      />

      <div>
        <h1>{product.name}</h1>
        <h2>₹{product.price}</h2>
        <p>{product.description}</p>

        {/* ✅ Stock status */}
        <p>
          <strong>Stock :</strong>{" "}
          <span
            style={{
              color: product.countInStock > 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {getStockText()}
          </span>
        </p>

        {/* ✅ Quantity selector */}
        {product.countInStock > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <button onClick={decreaseQty} disabled={qty === 1}>
              −
            </button>

            <span style={{ minWidth: "30px", textAlign: "center" }}>
              {qty}
            </span>

            <button
              onClick={increaseQty}
              disabled={qty === product.countInStock}
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;



