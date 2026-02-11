import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyOrders.css";

const ORDERS_PER_PAGE = 5;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/myorders");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <h2 className="status-text">Loading orders…</h2>;
  if (error) return <h2 className="status-text error">{error}</h2>;

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  return (
    <div className="myorders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven’t placed any orders yet.</p>
          <Link to="/" className="shop-link">Start Shopping</Link>
        </div>
      ) : (
        <>
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
                {paginatedOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>{order.isPaid ? "Yes" : "No"}</td>
                    <td>{order.isDelivered ? "Yes" : "No"}</td>
                    <td>
                      <Link to={`/order/${order._id}`} className="view-btn">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
