import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const AdminOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");


  /* ---------------- Fetch Orders ---------------- */
  const fetchOrders = async () => {
    try {
      let url = "http://localhost:5000/api/orders";

      if (filter === "paid") url += "?paid=true";
      if (filter === "pending") url += "?paid=false";
      if (filter === "delivered") url += "?delivered=true";

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
    if (user?.token) {
      setLoading(true);
      fetchOrders();
    }
  }, [user, filter]);

  /* ---------------- Mark Paid ---------------- */
  const markPaid = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/pay`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchOrders(); // 🔁 always refetch
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------------- Mark Delivered ---------------- */
  const markDelivered = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/deliver`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchOrders(); // 🔁 always refetch
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2 className="loading">Loading orders…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>

      {/* -------- Filters -------- */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("paid")}>Paid</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setFilter("delivered")}>Delivered</button>
      </div>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.user?.email || "User"}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>₹{order.totalPrice}</td>
                <td>{order.paymentMethod}</td>

                <td>
                  <span
                    className={
                      order.isPaid ? "status paid" : "status pending"
                    }
                  >
                    {order.isPaid ? "Yes" : "No"}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      order.isDelivered
                        ? "status delivered"
                        : "status pending"
                    }
                  >
                    {order.isDelivered ? "Yes" : "No"}
                  </span>
                </td>

                <td className="actions">
                  <Link
                    className="view-btn"
                    to={`/order/${order._id}`}
                  >
                    View
                  </Link>

                  {!order.isPaid && (
                    <button
                      className="btn"
                      onClick={() => markPaid(order._id)}
                    >
                      Mark Paid
                    </button>
                  )}

                  {!order.isDelivered && (
                    <button
                      className="btn secondary"
                      onClick={() => markDelivered(order._id)}
                    >
                      Deliver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;


