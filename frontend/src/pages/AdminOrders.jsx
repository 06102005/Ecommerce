import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const AdminOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
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

    fetchOrders();
  }, [user]);

  if (loading) return <h2 className="loading">Loading orders...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="admin-orders">
      <h1>Admin Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.user?.name || "User"}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>₹{order.totalPrice}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <span
                    className={
                      order.isPaid ? "paid" : "not-paid"
                    }
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td>
                  <Link
                    className="view-btn"
                    to={`/order/${order._id}`}
                  >
                    View
                  </Link>
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
