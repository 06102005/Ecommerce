import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./AdminOrders.css";

const ORDERS_PER_PAGE = 8;
const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

const AdminOrders = () => {
  const token = localStorage.getItem("adminToken");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ---------- Guard ---------- */
  if (!token) return <Navigate to="/login" replace />;

  /* ---------- Fetch ---------- */
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------- Filter ---------- */
  const activeOrders = orders.filter(
    (o) => !(o.isPaid && o.orderStatus === "Delivered")
  );

  const searchedOrders = activeOrders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.shippingAddress?.name?.toLowerCase().includes(q) ||
      o.shippingAddress?.email?.toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(searchedOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = searchedOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  /* ---------- Actions ---------- */
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  const markPaid = async (id) => {
    await fetch(`http://localhost:5000/api/orders/${id}/pay`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchOrders();
  };

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>Admin Orders</h1>
        <Link to="/admin/orders/done" className="done-page-btn">
          Done Orders
        </Link>
      </div>

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
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
  {paginatedOrders.map((o) => {
    const currentIndex = STATUS_FLOW.indexOf(o.orderStatus);
    const nextStatus = STATUS_FLOW[currentIndex + 1];

    return (
      <tr key={o._id}>
        <td>{o.shippingAddress?.name}</td>
        <td>{o.shippingAddress?.email}</td>
        <td>₹{o.totalPrice}</td>

        {/* Payment Status */}
        <td>
          {o.isPaid ? (
            <span className="badge paid">Paid</span>
          ) : (
            <>
              <span className="badge unpaid">Unpaid</span>
              <button
                className="pay-btn"
                onClick={() => markPaid(o._id)}
              >
                Mark Paid
              </button>
            </>
          )}
        </td>

        {/* Order Status + Update Button */}
        <td>
          <div className="status-column">
            <span className={`badge ${o.orderStatus.toLowerCase()}`}>
              {o.orderStatus}
            </span>

            {nextStatus && (
              <button
                className="status-btn"
                onClick={() =>
                  updateStatus(o._id, nextStatus)
                }
              >
                Mark {nextStatus}
              </button>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="actions">
          <Link
            to={`/order/${o._id}`}
            className="view-btn"
          >
            View
          </Link>

          <button
            onClick={() => deleteOrder(o._id)}
            className="delete-btn"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

      </table>
      {/* ---------- Pagination ---------- */}
<div className="pagination">
  <button
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Prev
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>

    </div>
  );
};

export default AdminOrders;
