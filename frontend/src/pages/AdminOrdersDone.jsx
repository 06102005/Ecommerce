import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./AdminOrdersDone.css";

const ORDERS_PER_PAGE = 6;

const AdminOrdersDone = () => {
  const token = localStorage.getItem("adminToken");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ---------- Guard ---------- */
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /* ---------- Fetch ---------- */
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const doneOrders = (Array.isArray(data) ? data : []).filter(
        (o) => o.isPaid && o.orderStatus === "Delivered"
      );

      setOrders(doneOrders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------- Search ---------- */
  const searchedOrders = orders.filter((o) => {
    const q = search.toLowerCase();

    return (
      o.shippingAddress?.name?.toLowerCase().includes(q) ||
      o.shippingAddress?.email?.toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q)
    );
  });

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(
    1,
    Math.ceil(searchedOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = searchedOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  /* ---------- Delete ---------- */
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this completed order?")) return;

    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchOrders();
  };

  return (
    <div className="admin-orders">
      <h1>Completed Orders</h1>

      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <table>
        <tbody>
          {paginatedOrders.map((o) => (
            <tr key={o._id}>
              <td>{o.shippingAddress?.name}</td>
              <td>{o.shippingAddress?.email}</td>
              <td>₹{o.totalPrice}</td>
              <td>Delivered</td>
              <td>
                <Link to={`/order/${o._id}`}>View</Link>
                <button onClick={() => deleteOrder(o._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrdersDone;
