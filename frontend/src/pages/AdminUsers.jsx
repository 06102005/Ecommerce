import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Use SAME token key as dashboard
  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!Array.isArray(res.data)) {
      setAdmins([]);
      return;
    }

    const onlyAdmins = res.data.filter(
      (user) => user.role === "admin"
    );

    setAdmins(onlyAdmins);

  } catch (err) {
    setError("Failed to load admins");
    console.error(err.response?.data || err.message);
  }
};


  useEffect(() => {
    if (token) fetchAdmins();
  }, [token]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/admin/users",
        { email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmail("");
      setPassword("");
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating admin");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAdmins();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="admin-users">
      <h2>Manage Admin Users</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAddAdmin}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Add Admin</button>
      </form>

      <hr />

      <h3>Existing Admins</h3>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(admins) &&
            admins.map((admin) => (
              <tr key={admin._id}>
                <td>{admin.email}</td>
                <td>
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(admin._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
