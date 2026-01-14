import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // 🔐 Protect page
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

        if (!res.ok) {
          throw new Error(data.message || "Failed to load cart");
        }

        setCartItems(data.filter(item => item.product));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            product: item.product._id,
            qty: item.qty,
            price: item.product.price,
          })),
          shippingAddress,
          paymentMethod,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order creation failed");
      }

      // COD → directly success
      if (paymentMethod === "COD") {
        navigate(`/order/${data._id}`);
      } else {
        // ONLINE → payment page (later)
        navigate(`/payment/${data._id}`);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>

      <form onSubmit={submitHandler}>
        <h2>Shipping Address</h2>

        <input
          type="text"
          placeholder="Address"
          required
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="City"
          required
          value={shippingAddress.city}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, city: e.target.value })
          }
        />

        <input
          type="text"
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
          type="text"
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

        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <br />

        <label>
          <input
            type="radio"
            value="ONLINE"
            checked={paymentMethod === "ONLINE"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Online Payment
        </label>

        <h2>Order Summary</h2>

        {cartItems.map(item => (
          <p key={item.product._id}>
            {item.product.name} × {item.qty} = ₹
            {item.product.price * item.qty}
          </p>
        ))}

        <h3>Total: ₹{totalPrice}</h3>

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
