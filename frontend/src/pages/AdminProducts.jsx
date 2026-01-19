import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminProducts.css";

const AdminProducts = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: null,
    description: "",
  });

  /* ---------- Fetch Products ---------- */
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data.products || data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- Submit ---------- */
  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    const url = editingId
      ? `http://localhost:5000/api/products/${editingId}`
      : "http://localhost:5000/api/products";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    resetForm();
    fetchProducts();
  };

  /* ---------- Delete ---------- */
  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    fetchProducts();
  };

  /* ---------- Edit ---------- */
  const editHandler = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      image: null,
      description: p.description,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", price: "", image: null, description: "" });
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="admin-products">
      <h1>Admin Products</h1>

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
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files[0] })
          }
        />

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

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
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
    </div>
  );
};

export default AdminProducts;


