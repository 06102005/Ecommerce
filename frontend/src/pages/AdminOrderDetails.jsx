import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrderDetails.css";

const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH ORDER ---------------- */
  const fetchOrder = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load order");

      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.token || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchOrder();
  }, [id, user]);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (nextStatus) => {
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

      fetchOrder();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2 className="loading">Loading order…</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!order) return null;

  const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);
  const nextStatus = STATUS_FLOW[currentIndex + 1];

  return (
    <div className="admin-order-details">
      <h1>Order #{order._id.slice(-6)}</h1>

      {/* ---------- STATUS TIMELINE ---------- */}
      <div className="status-timeline">
        {STATUS_FLOW.map((s, i) => (
          <div
            key={s}
            className={`timeline-step ${
              i <= currentIndex ? "active" : ""
            }`}
          >
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* ---------- ACTION ---------- */}
      {nextStatus && !order.isCancelled && (
        <button
          className="next-status-btn"
          onClick={() => updateStatus(nextStatus)}
        >
          Mark as {nextStatus}
        </button>
      )}

      {/* ---------- ORDER INFO ---------- */}
      <div className="box">
        <p><strong>User:</strong> {order.user.name} ({order.user.email})</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Paid:</strong>{" "}
          <span className={order.isPaid ? "paid" : "pending"}>
            {order.isPaid ? "Yes" : "No"}
          </span>
        </p>
        <p>
          <strong>Cancelled:</strong>{" "}
          {order.isCancelled ? "Yes" : "No"}
        </p>
        {order.isCancelled && (
          <p><strong>Reason:</strong> {order.cancelReason}</p>
        )}
      </div>

      {/* ---------- SHIPPING ---------- */}
      <div className="box">
        <h2>Shipping Address</h2>
        <p>{order.shippingAddress.address}</p>
        <p>
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>

      {/* ---------- ITEMS ---------- */}
      <div className="box">
        <h2>Order Items</h2>

        {order.orderItems.map((item, idx) => (
          <div key={idx} className="item">
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.name}
            />
            <div>
              <p className="name">{item.name}</p>
              <p>
                {item.qty} × ₹{item.price}
              </p>
            </div>
            <strong>₹{item.qty * item.price}</strong>
          </div>
        ))}
      </div>

      {/* ---------- TOTAL ---------- */}
      <div className="total">
        Total: ₹{order.totalPrice}
      </div>
    </div>
  );
};

export default AdminOrderDetails;
