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

  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data.products || data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- ADD / UPDATE PRODUCT ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    setEditingId(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      image: null,
      description: "",
    });
    setPreview(null);

    fetchProducts();
  };

  /* ---------------- EDIT ---------------- */
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

  /* ---------------- DELETE ---------------- */
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    fetchProducts();
  };

  if (loading) return <h2 className="loading">Loading…</h2>;

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const paginated = filtered.slice(start, start + PRODUCTS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);

  return (
    <div className="admin-products">
      <h1>Admin Products</h1>

      <input
        className="search"
        placeholder="Search…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* -------- PRODUCT FORM -------- */}
      <form className="product-form" onSubmit={submitHandler}>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          required
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="number"
          required
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
          }}
        />

        {preview && <img src={preview} className="preview" alt="preview" />}

        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="actions">
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  price: "",
                  stock: "",
                  image: null,
                  description: "",
                });
                setPreview(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* -------- PRODUCTS TABLE -------- */}
      {paginated.length === 0 ? (
        <p className="empty">No products found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <tr key={p._id}>
                <td data-label="Image">
                  <img
                    src={`http://localhost:5000${p.image}`}
                    alt={p.name}
                  />
                </td>

                <td data-label="Name">{p.name}</td>

                <td data-label="Price">₹{p.price}</td>

                <td data-label="Stock">
                 {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </td>

                <td data-label="Actions">
                  <button onClick={() => editHandler(p)}>Edit</button>
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
      )}

      {/* -------- PAGINATION -------- */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
