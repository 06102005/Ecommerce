import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import "./AdminOrderDetails.css";

const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("adminToken");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const fetchOrder = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (nextStatus) => {
    await fetch(
      `http://localhost:5000/api/orders/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      }
    );

    fetchOrder();
  };

  if (loading) return <h2>Loading…</h2>;
  if (error) return <h2>{error}</h2>;
  if (!order) return null;

  const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);
  const nextStatus = STATUS_FLOW[currentIndex + 1];

  return (
    <div>
      <h1>Order #{order._id.slice(-6)}</h1>

      {nextStatus && (
        <button onClick={() => updateStatus(nextStatus)}>
          Mark {nextStatus}
        </button>
      )}
    </div>
  );
};

export default AdminOrderDetails;
