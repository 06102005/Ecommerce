import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminOrdersDone.css";

const ORDERS_PER_PAGE = 6;

const AdminOrdersDone = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ---------------- FETCH DONE ORDERS ---------------- */
  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();

    setOrders(data.filter((o) => o.isPaid && o.orderStatus === "Delivered"));
  };

  useEffect(() => {
    if (user?.role === "admin") fetchOrders();
  }, [user]);

  /* ---------------- GLOBAL SEARCH ---------------- */
  const searchedOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o._id.toLowerCase().includes(q)
    );
  });

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.max(
    1,
    Math.ceil(searchedOrders.length / ORDERS_PER_PAGE)
  );

  const paginatedOrders = searchedOrders.slice(
    (page - 1) * ORDERS_PER_PAGE,
    page * ORDERS_PER_PAGE
  );

  /* ---------------- DELETE ORDER ---------------- */
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this completed order?")) return;

    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });

    fetchOrders();
  };

  /* ---------------- GUARD ---------------- */
  if (!user || user.role !== "admin") {
    return <h2 className="error">Not authorized</h2>;
  }

  return (
    <div className="admin-orders">
      <h1>Completed Orders</h1>

      {/* -------- Search -------- */}
      <input
        className="search"
        placeholder="Search by user / email / order id..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* -------- Table -------- */}
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.length === 0 ? (
            <tr>
              <td colSpan="5">No completed orders found</td>
            </tr>
          ) : (
            paginatedOrders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-6)}</td>

                <td>
                  <strong>{o.user?.name}</strong>
                  <br />
                  <small>{o.user?.email}</small>
                </td>

                <td>₹{o.totalPrice}</td>

                <td>
                  <span className="status delivered">Delivered</span>
                </td>

                <td className="actions">
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
            ))
          )}
        </tbody>
      </table>

      {/* -------- Pagination -------- */}
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

export default AdminOrdersDone;
