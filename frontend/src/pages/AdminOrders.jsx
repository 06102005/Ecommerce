import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const ORDERS_PER_PAGE = 6;
const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

const AdminOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load orders");

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user]);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (id, nextStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------------- GUARD ---------------- */
  if (!user || user.role !== "admin") {
    return <h2 className="error">Not authorized</h2>;
  }

  if (loading) return <h2 className="loading">Loading orders…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(start, start + ORDERS_PER_PAGE);

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>

      {paginatedOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((o) => {
                const currentIndex = STATUS_FLOW.indexOf(o.orderStatus);
                const nextStatus = STATUS_FLOW[currentIndex + 1];

                return (
                  <tr key={o._id}>
                    <td>{o._id.slice(-6)}</td>
                    <td>{o.user?.email}</td>
                    <td>₹{o.totalPrice}</td>
                    <td>
                      <span
                        className={`status ${
                          o.isPaid ? "paid" : "pending"
                        }`}
                      >
                        {o.isPaid ? "Paid" : "COD"}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${o.orderStatus.toLowerCase()}`}>
                        {o.orderStatus}
                      </span>
                    </td>

                    <td>
                      {nextStatus ? (
                        <button
                          className="status-btn"
                          onClick={() => updateStatus(o._id, nextStatus)}
                        >
                          Mark {nextStatus}
                        </button>
                      ) : (
                        <span className="done">✓</span>
                      )}
                    </td>

                    <td>
                      <Link className="view-btn" to={`/order/${o._id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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






