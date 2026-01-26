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
    countInStock: "",
    image: null,
    description: "",
  });

  const [preview, setPreview] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data.products || data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", Number(form.price));
    formData.append("countInStock", Number(form.countInStock));
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${user.token}` },
      body: formData,
    });

    setEditingId(null);
    setForm({
      name: "",
      price: "",
      countInStock: "",
      image: null,
      description: "",
    });
    setPreview(null);
    fetchProducts();
  };

  const editHandler = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      countInStock: p.countInStock,
      image: null,
      description: p.description,
    });
    setPreview(`http://localhost:5000${p.image}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    fetchProducts();
  };

  if (loading) return <h2>Loading…</h2>;

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

      <form className="product-form" onSubmit={submitHandler}>
        <input required placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input type="number" required placeholder="Price" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })} />

        <input type="number" required placeholder="Stock" value={form.countInStock}
          onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />

        <input type="file" onChange={(e) => {
          const file = e.target.files[0];
          setForm({ ...form, image: file });
          setPreview(URL.createObjectURL(file));
        }} />

        {preview && <img src={preview} className="preview" alt="preview" />}

        <textarea required placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p) => (
            <tr key={p._id}>
              <td><img src={`http://localhost:5000${p.image}`} alt={p.name} /></td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                {p.countInStock > 0
                  ? `In Stock`
                  : "Out of stock"}
              </td>
              <td>
                <button onClick={() => editHandler(p)}>Edit</button>
                <button onClick={() => deleteHandler(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
