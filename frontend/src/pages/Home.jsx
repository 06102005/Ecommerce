import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load products");
        }

        // Works for both array response and { products: [] }
        setProducts(data.products || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2>Loading products...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <h3 style={{ margin: "10px 0 5px" }}>{product.name}</h3>
                <p style={{ fontWeight: "bold" }}>₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;


