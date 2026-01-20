import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const PRODUCTS_PER_PAGE = 8;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- Fetch Products ---------- */
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

  /* ---------- Search ---------- */
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    start,
    start + PRODUCTS_PER_PAGE
  );

  /* Reset page when search changes */
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ---------- Guards ---------- */
  if (loading) return <h2 className="status-text">Loading products…</h2>;
  if (error) return <h2 className="status-text error">{error}</h2>;

  return (
    <div className="home">
      {/* ---------- Hero ---------- */}
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

      {/* ---------- Products ---------- */}
      <div className="products-container">
        {paginatedProducts.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="product-card"
                >
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                </Link>
              ))}
            </div>

            {/* ---------- Pagination ---------- */}
            <div className="pagination">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>

              <span>
                Page {safePage} / {totalPages}
              </span>

              <button
                disabled={safePage === totalPages}
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;




