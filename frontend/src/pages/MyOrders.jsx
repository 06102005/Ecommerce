import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MyOrders.css";

const ORDERS_PER_PAGE = 5;

const MyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

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

  /* ---------------- Pagination Logic ---------------- */
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(
    startIndex,
    startIndex + ORDERS_PER_PAGE
  );

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
                {paginatedOrders.map((order) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrders;


