import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
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

        setProducts(data.products || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h2 className="status-text">Loading products...</h2>;
  if (error) return <h2 className="status-text error">{error}</h2>;

  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <h1>My Ecommerce Store</h1>
        <p>Shop the latest trends at the best prices</p>

        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Section */}
      <div className="products-container">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="product-card"
              >
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                />
                <h3>{product.name}</h3>
                <p>₹{product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



