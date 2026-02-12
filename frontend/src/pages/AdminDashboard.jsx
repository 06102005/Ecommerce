import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);



const AdminDashboard = () => {
  const token = localStorage.getItem("adminToken");

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    monthlySales: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load stats");
        }

        setStats({
          totalOrders: Number(data.totalOrders) || 0,
          totalRevenue: Number(data.totalRevenue) || 0,
          monthlySales: Array.isArray(data.monthlySales)
            ? data.monthlySales
            : [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) return <h2 className="loading">Loading dashboard…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  const chartData = {
    labels: stats.monthlySales.map((m) => m.month),
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: stats.monthlySales.map((m) => m.total),
        backgroundColor: "#ff7a00",
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="card revenue">
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-box">
        <h2>Monthly Sales</h2>

        {stats.monthlySales.length === 0 ? (
          <p className="empty">No sales data yet</p>
        ) : (
          <Bar data={chartData} />
        )}
      </div>

      {/* Links */}
      <div className="admin-links">
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
        <Link to="/admin/users">Manage Users</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
