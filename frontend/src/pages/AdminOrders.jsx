import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.css";

const ORDERS_PER_PAGE = 6;
const STATUS_FLOW = ["Pending", "Processing", "Shipped", "Delivered"];

const AdminOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- FETCH ORDERS ---------------- */
  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user]);

  /* ---------------- ACTIVE ORDERS ONLY ---------------- */
  const activeOrders = orders.filter(
    (o) => !(o.isPaid && o.orderStatus === "Delivered")
  );

  /* ---------------- SEARCH (GLOBAL) ---------------- */
  const searchedOrders = activeOrders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q)
    );
  });

  /* ---------------- PAGINATION AFTER SEARCH ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(searchedOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = searchedOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  /* ---------------- ACTIONS ---------------- */
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const markPaid = async (id) => {
    await fetch(`http://localhost:5000/api/orders/${id}/pay`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    fetchOrders();
  };

  return (
    <div className="admin-orders">
      {/* ---------- Header ---------- */}
      <div className="orders-header">
        <h1>Admin Orders</h1>

        <Link to="/admin/orders/done" className="done-page-btn">
          Done Orders
        </Link>
      </div>

      {/* ---------- Search ---------- */}
      <input
        className="search"
        placeholder="Search by user / email / order id..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* ---------- Table ---------- */}
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>User</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.length === 0 ? (
            <tr>
              <td colSpan="7">No orders found</td>
            </tr>
          ) : (
            paginatedOrders.map((o) => {
              const nextStatus =
                STATUS_FLOW[STATUS_FLOW.indexOf(o.orderStatus) + 1];

              return (
                <tr key={o._id}>
                  <td>{o._id.slice(-6)}</td>

                  <td>
                    <strong>{o.user?.name}</strong>
                    <br />
                    <small>{o.user?.email}</small>
                  </td>

                  <td>₹{o.totalPrice}</td>

                  <td>
                    <span
                      className={`status ${
                        o.isPaid ? "paid" : "pending"
                      }`}
                    >
                      {o.isPaid ? "Paid" : o.paymentMethod}
                    </span>

                    {!o.isPaid && (
                      <button
                        className="pay-btn"
                        onClick={() => markPaid(o._id)}
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>

                  <td>
                    <span
                      className={`status ${o.orderStatus.toLowerCase()}`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>

                  <td>
                    {nextStatus ? (
                      <button
                        className="status-btn"
                        onClick={() =>
                          updateStatus(o._id, nextStatus)
                        }
                      >
                        Mark {nextStatus}
                      </button>
                    ) : (
                      <span className="done">✓</span>
                    )}
                  </td>

                  <td className="action-col">
                    <Link
                      to={`/order/${o._id}`}
                      className="view-btn"
                    >
                      View
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(o._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ---------- Pagination ---------- */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
