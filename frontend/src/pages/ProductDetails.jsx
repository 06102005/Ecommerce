import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        style={{ width: "300px", objectFit: "cover" }}
      />
      <h1>{product.name}</h1>
      <p>₹{product.price}</p>
      <p>{product.description}</p>
      <p>
        Status:{" "}
        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
      </p>

      <button disabled={product.countInStock === 0}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
