import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MyOrders.css";

const MyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- Fetch My Orders ---------------- */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;

      try {
        const res = await fetch(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to load orders");

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ---------------- Guards ---------------- */
  if (!user)
    return <h2 className="status-text">Please login</h2>;

  if (loading)
    return <h2 className="status-text">Loading orders…</h2>;

  if (error)
    return <h2 className="status-text error">{error}</h2>;

  return (
    <div className="myorders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven’t placed any orders yet.</p>
          <Link to="/" className="shop-link">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td data-label="Order ID">
                    {order._id.slice(-6)}
                  </td>

                  <td data-label="Date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td data-label="Total">
                    ₹{order.totalPrice}
                  </td>

                  <td data-label="Paid">
                    <span
                      className={`status ${
                        order.isPaid ? "paid" : "pending"
                      }`}
                    >
                      {order.isPaid ? "Yes" : "No"}
                    </span>
                  </td>

                  <td data-label="Delivered">
                    <span
                      className={`status ${
                        order.isDelivered
                          ? "delivered"
                          : "pending"
                      }`}
                    >
                      {order.isDelivered ? "Yes" : "No"}
                    </span>
                  </td>

                  <td data-label="Action">
                    <Link
                      to={`/order/${order._id}`}
                      className="view-btn"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

