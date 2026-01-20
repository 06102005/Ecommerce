import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const ORDERS_PER_PAGE = 6;

const AdminOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  /* ---------- Fetch Orders (ONLY filter/user) ---------- */
  const fetchOrders = async () => {
    if (!user?.token) return;

    try {
      let url = "http://localhost:5000/api/orders";
      if (filter === "paid") url += "?paid=true";
      if (filter === "pending") url += "?paid=false";
      if (filter === "delivered") url += "?delivered=true";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load orders");

      setOrders(data);
      setSelected([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);          // ✅ reset page ONLY when filter changes
    fetchOrders();
  }, [filter, user]);

  /* ---------- Guards ---------- */
  if (!user || user.role !== "admin") {
    return <h2 className="error">Not authorized</h2>;
  }

  /* ---------- Pagination ---------- */
  const totalPages = Math.max(
    1,
    Math.ceil(orders.length / ORDERS_PER_PAGE)
  );

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(start, start + ORDERS_PER_PAGE);

  /* ---------- Selection ---------- */
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = paginatedOrders.map((o) => o._id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    setSelected(allSelected ? [] : pageIds);
  };

  /* ---------- Bulk Actions ---------- */
  const bulkAction = async (type) => {
    if (selected.length === 0) return;

    await Promise.all(
      selected.map((id) =>
        fetch(`http://localhost:5000/api/orders/${id}/${type}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        })
      )
    );

    fetchOrders();
  };

  if (loading) return <h2 className="loading">Loading orders…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>

      {/* Filters */}
      <div className="filters">
        {["all", "paid", "pending", "delivered"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bulk-actions">
          <span>{selected.length} selected</span>
          <button onClick={() => bulkAction("pay")}>Mark Paid</button>
          <button onClick={() => bulkAction("deliver")}>
            Mark Delivered
          </button>
        </div>
      )}

      {paginatedOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      paginatedOrders.length > 0 &&
                      paginatedOrders.every((o) =>
                        selected.includes(o._id)
                      )
                    }
                    onChange={selectAll}
                  />
                </th>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(o._id)}
                      onChange={() => toggleSelect(o._id)}
                    />
                  </td>
                  <td>{o._id.slice(-6)}</td>
                  <td>{o.user?.email || "User"}</td>
                  <td>₹{o.totalPrice}</td>
                  <td>
                    <span className={`status ${o.isPaid ? "paid" : "pending"}`}>
                      {o.isPaid ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${
                        o.isDelivered ? "delivered" : "pending"
                      }`}
                    >
                      {o.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <Link className="view-btn" to={`/order/${o._id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={safePage === 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setSelected([]);
              }}
            >
              Prev
            </button>

            <span>
              Page {safePage} / {totalPages}
            </span>

            <button
              disabled={safePage === totalPages}
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                setSelected([]);
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;





