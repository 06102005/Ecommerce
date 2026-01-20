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
  const [placingOrder, setPlacingOrder] = useState(false);

  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem("shippingAddress");
    return saved
      ? JSON.parse(saved)
      : { address: "", city: "", postalCode: "", country: "" };
  });

  /* ---------------- Fetch Cart ---------------- */
  useEffect(() => {
    if (!user?.token) {
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

        const items = Array.isArray(data) ? data : data.items || [];
        setCartItems(items.filter((item) => item.product));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  /* ---------------- Persist Address ---------------- */
  useEffect(() => {
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(shippingAddress)
    );
  }, [shippingAddress]);

  const itemsPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  /* ---------------- Submit Order ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    setPlacingOrder(true);

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

      localStorage.removeItem("shippingAddress");
      navigate(`/order/${order._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <h2 className="loading">Loading checkout…</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  if (cartItems.length === 0)
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")}>Go Shopping</button>
      </div>
    );

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={submitHandler}>
        {/* Shipping */}
        <h2>Shipping Address</h2>

        <input
          required
          placeholder="Address"
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
        />

        <div className="row">
          <input
            required
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
          />

          <input
            required
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                postalCode: e.target.value,
              })
            }
          />
        </div>

        <input
          required
          placeholder="Country"
          value={shippingAddress.country}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              country: e.target.value,
            })
          }
        />

        {/* Payment */}
        <h2>Payment Method</h2>

        <label className="radio">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>

        <label className="radio disabled">
          <input type="radio" disabled />
          Online Payment (coming soon)
        </label>

        {/* Summary */}
        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.product._id} className="summary-item">
            <img  src={`http://localhost:5000${item.product.image}`} alt={item.product.name} />
            <div>
              <p>{item.product.name}</p>
              <span>
                {item.qty} × ₹{item.product.price}
              </span>
            </div>
            <strong>₹{item.qty * item.product.price}</strong>
          </div>
        ))}

        <div className="price-box">
          <div>
            <span>Items</span>
            <span>₹{itemsPrice}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          className="place-order-btn"
          disabled={placingOrder}
        >
          {placingOrder ? "Placing Order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;


