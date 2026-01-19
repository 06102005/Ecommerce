import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminUsers.css";

const AdminUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------- Fetch Users ---------- */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");

      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user]);

  /* ---------- Update Role ---------- */
  const updateRole = async (id, role) => {
    if (!window.confirm("Change user role?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------- Delete User ---------- */
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------- Guards ---------- */
  if (!user || user.role !== "admin") {
    return <h2 className="error">Not authorized</h2>;
  }

  if (loading) return <h2 className="loading">Loading users…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  /* ---------- Search ---------- */
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users">
      <h1>Admin Users</h1>

      <input
        className="search"
        placeholder="Search users…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id}>
              <td data-label="Name">{u.name}</td>
              <td data-label="Email">{u.email}</td>
              <td data-label="Role">
                <select
                  value={u.role}
                  onChange={(e) =>
                    updateRole(u._id, e.target.value)
                  }
                  disabled={u._id === user._id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td data-label="Actions">
                {u._id !== user._id && (
                  <button
                    className="danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <p className="empty">No users found</p>
      )}
    </div>
  );
};

export default AdminUsers;
