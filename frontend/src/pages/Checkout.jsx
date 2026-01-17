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

  /* ---------------- Razorpay Loader ---------------- */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
        if (!res.ok) throw new Error(data.message);

        setCartItems(data.filter((item) => item.product));
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

  /* ---------------- Submit Order ---------------- */
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      /* 1️⃣ Create order in DB */
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map((item) => ({
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            qty: item.qty,
            product: item.product._id,
          })),
          shippingAddress,
          paymentMethod,
          totalPrice,
        }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.message);

      /* 2️⃣ COD → Done */
      if (paymentMethod === "COD") {
        navigate(`/order/${order._id}`);
        return;
      }

      /* 3️⃣ Razorpay Payment */
      await startRazorpayPayment(order);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------------- Razorpay Payment ---------------- */
  const startRazorpayPayment = async (order) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    /* Create Razorpay order (backend) */
    const res = await fetch("http://localhost:5000/api/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        orderId: order._id,
        amount: order.totalPrice,
      }),
    });

    const razorOrder = await res.json();
    if (!res.ok) throw new Error(razorOrder.message);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      order_id: razorOrder.id,
      name: "My Ecommerce Store",
      description: "Order Payment",

      handler: async function (response) {
        /* Verify payment */
        const verifyRes = await fetch(
          "http://localhost:5000/api/payment/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              ...response,
              orderId: order._id,
            }),
          }
        );

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          alert(verifyData.message);
          return;
        }

        navigate(`/order/${order._id}`);
      },

      theme: { color: "#3399cc" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout</h1>

      <form onSubmit={submitHandler}>
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
            value="Razorpay"
            checked={paymentMethod === "Razorpay"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Online Payment
        </label>

        <h2>Order Summary</h2>

        {cartItems.map((item) => (
          <p key={item.product._id}>
            {item.product.name} × {item.qty} = ₹
            {item.product.price * item.qty}
          </p>
        ))}

        <h3>Total: ₹{totalPrice}</h3>

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
