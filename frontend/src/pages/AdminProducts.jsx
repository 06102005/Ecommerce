import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminProducts.css";

const PRODUCTS_PER_PAGE = 6;

const AdminProducts = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
    description: "",
  });

  const [preview, setPreview] = useState(null);

  /* ---------- Fetch Products ---------- */
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data.products || data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- Submit ---------- */
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user?.token) return alert("Unauthorized");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== "") formData.append(k, v);
    });

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${user.token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message || "Request failed");

    resetForm();
    fetchProducts();
  };

  /* ---------- Delete ---------- */
  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    fetchProducts();
  };

  /* ---------- Edit ---------- */
  const editHandler = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      image: null,
      description: p.description,
    });
    setPreview(`http://localhost:5000${p.image}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      image: null,
      description: "",
    });
    setPreview(null);
  };

  /* ---------- Search + Pagination ---------- */
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const paginated = filtered.slice(start, start + PRODUCTS_PER_PAGE);

  if (loading) return <h2 className="loading">Loading products…</h2>;

  return (
    <div className="admin-products">
      <h1>Admin Products</h1>

      {/* -------- Search -------- */}
      <input
        className="search"
        placeholder="Search products…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* -------- Form -------- */}
      <form onSubmit={submitHandler} className="product-form">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

        <input
          placeholder="Product Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          required
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && (
          <img src={preview} alt="Preview" className="preview" />
        )}

        <textarea
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="actions">
          <button type="submit">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* -------- Products -------- */}
      {paginated.length === 0 ? (
        <p className="empty">No products found</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={`http://localhost:5000${p.image}`}
                      alt={p.name}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>
                    {p.stock > 0 ? (
                      <span className="in-stock">
                        In Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="out-stock">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => editHandler(p)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteHandler(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProducts;
