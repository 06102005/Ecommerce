import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./AdminOrders.css";

const ORDERS_PER_PAGE = 6;
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
            const nextStatus =
              STATUS_FLOW[STATUS_FLOW.indexOf(o.orderStatus) + 1];

            return (
              <tr key={o._id}>
                <td>{o.shippingAddress?.name}</td>
                <td>{o.shippingAddress?.email}</td>
                <td>₹{o.totalPrice}</td>

                {/* Payment */}
                <td>
                  {o.isPaid ? (
                    <span className="paid">Paid</span>
                  ) : (
                    <button onClick={() => markPaid(o._id)}>
                      Mark Paid
                    </button>
                  )}
                </td>

                {/* Status */}
                <td>
                  <span className={`status ${o.orderStatus.toLowerCase()}`}>
                    {o.orderStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="actions">
                  <Link to={`/order/${o._id}`}>View</Link>
                  {nextStatus && (
                    <button
                      onClick={() =>
                        updateStatus(o._id, nextStatus)
                      }
                    >
                      Mark {nextStatus}
                    </button>
                  )}

                  <button onClick={() => deleteOrder(o._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
