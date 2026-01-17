import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  /* ---------------- Fetch Cart ---------------- */
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load cart");

        // ✅ FIX: support both array & object response
        const items = Array.isArray(data) ? data : data.items || [];

        // ✅ Remove broken cart items
        setCartItems(items.filter((item) => item.product));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  /* ---------------- Submit Order ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map((item) => ({
            product: item.product._id,
            qty: item.qty,
          })),
          shippingAddress,
          paymentMethod,
          totalPrice,
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.message || "Order failed");

      // ✅ Payment handling later
      navigate(`/order/${order._id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2 className="loading">Loading checkout...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={submitHandler}>
        <h2>Shipping Address</h2>

        <input
          placeholder="Address"
          required
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
        />

        <input
          placeholder="City"
          required
          value={shippingAddress.city}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, city: e.target.value })
          }
        />

        <input
          placeholder="Postal Code"
          required
          value={shippingAddress.postalCode}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              postalCode: e.target.value,
            })
          }
        />

        <input
          placeholder="Country"
          required
          value={shippingAddress.country}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              country: e.target.value,
            })
          }
        />

        <h2>Payment Method</h2>

        <label className="radio">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label className="radio">
          <input
            type="radio"
            value="Razorpay"
            checked={paymentMethod === "Razorpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Online Payment (later)
        </label>

        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.product._id} className="summary-item">
            <span>{item.product.name}</span>
            <span>
              {item.qty} × ₹{item.product.price}
            </span>
          </div>
        ))}

        <h3>Total: ₹{totalPrice}</h3>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;

