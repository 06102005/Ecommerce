import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProductForm = () => {
  const { id } = useParams(); // undefined → create
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    stock: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const res = await fetch(
        `http://localhost:5000/api/products/${id}`
      );
      const data = await res.json();

      setProduct({
        name: data.name || "",
        price: data.price || "",
        image: data.image || "",
        description: data.description || "",
        stock: data.stock || "",
      });
    };

    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:5000/api/products/${id}`
      : `http://localhost:5000/api/products`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      alert("Failed to save product");
      return;
    }

    navigate("/admin/products");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>{id ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={submitHandler}>
        <input
          placeholder="Name"
          value={product.name}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          required
        />

        <input
          placeholder="Price"
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
          required
        />

        <input
          placeholder="Image path ( /uploads/xxx.jpg )"
          value={product.image}
          onChange={(e) =>
            setProduct({ ...product, image: e.target.value })
          }
          required
        />

        <input
          placeholder="Stock Quantity"
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({
              ...product,
              stock: e.target.value,
            })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value,
            })
          }
        />

        <button type="submit">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
