import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>

      {user ? (
        <>
          {user.role === "admin" && (
            <Link to="/admin/orders">Admin</Link>
          )}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;

