import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useBuyNow } from "../context/BuyNowContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { user } = useAuth();
  const { buyNowItem, setBuyNowItem } = useBuyNow();

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  /* ---------------- SHIPPING FORM ---------------- */
  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem("shippingAddress");
    return saved
      ? JSON.parse(saved)
      : {
          address: "",
          city: "",
          postalCode: "",
          country: "",
          phoneNumber: "", // ✅ NEW
        };
  });

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid cart data");

        setCartItems(data.filter((item) => item.product));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  /* ---------------- SAVE ADDRESS ---------------- */
  useEffect(() => {
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  /* ---------------- CALCULATIONS ---------------- */
  const checkoutItems = useMemo(() => {
  if (buyNowItem) return [buyNowItem];
  return cartItems;
}, [buyNowItem, cartItems]);


  const itemsPrice = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const totalPrice = itemsPrice + shippingPrice;

  /* ---------------- SUBMIT ORDER ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) return;

    setPlacingOrder(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: checkoutItems.map((item) => ({
            product: item.product._id,
            qty: item.qty,
          })),
          shippingAddress,
          totalPrice, // ✅ no paymentMethod anymore
        }),
      });

      const order = await res.json();

      if (!res.ok) throw new Error(order.message || "Order failed");

      // If buy now → just clear buyNow state
if (buyNowItem) {
  setBuyNowItem(null);
} else {
  // normal cart order
  await fetch("http://localhost:5000/api/cart/clear", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

      localStorage.removeItem("shippingAddress");

      navigate(`/order/${order._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) return <h2>Loading checkout…</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={submitHandler}>
        {/* ---------------- USER DETAILS ---------------- */}
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

        {/* ✅ NEW PHONE INPUT */}
        <input
          required
          placeholder="Your Phone Number"
          value={shippingAddress.phoneNumber}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              phoneNumber: e.target.value,
            })
          }
        />

        {/* ---------------- ADMIN PAYMENT INFO ---------------- */}
        <h2>Payment Information</h2>

        <div className="qr-section">
          <img src="/qr-code.png" alt="QR Code" className="qr-image" />

          <p><strong>Admin Phone:</strong> 9876543210</p>
          <p><strong>Account No:</strong> 1234567890</p>
          <h3>Note !!</h3>
          <p>Send the Screenshot of the payment to the whatsApp of the Above Number
            to verify your payment.  </p>
        </div>

        {/* ---------------- SUMMARY ---------------- */}
        <h2>Order Summary</h2>

        {checkoutItems.map((item) => (
          <div key={item.product._id} className="summary-item">
            <img
              src={`http://localhost:5000${item.product.image}`}
              alt={item.product.name}
            />
            <div>
              <p>{item.product.name}</p>
              <span>{item.qty} × ₹{item.product.price}</span>
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
          disabled={placingOrder}
          className="place-order-btn"
        >
          {placingOrder ? "Placing Order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
