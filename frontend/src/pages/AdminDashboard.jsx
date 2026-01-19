import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return <h2 className="loading">Checking access…</h2>;
  if (user.role !== "admin")
    return <h2 className="error">Not authorized</h2>;
  if (loading) return <h2 className="loading">Loading dashboard…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  /* ---------- Chart Data ---------- */
  const chartData = {
    labels: stats.monthlySales.map((m) => m.month),
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: stats.monthlySales.map((m) => m.total),
        backgroundColor: "#ff9800",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* -------- Stats Cards -------- */}
      <div className="stats-grid">
        <div className="card">
          <h3>Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="card">
          <h3>Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="card">
          <h3>Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="card revenue">
          <h3>Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>

      {/* -------- Monthly Sales Chart -------- */}
      <div className="chart-card">
        <h2>Monthly Sales</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* -------- Quick Links -------- */}
      <div className="admin-links">
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
        <Link to="/admin/users">Manage Users</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;




