import { useEffect, useState, useMemo } from "react";
import { useBuyNow } from "../context/BuyNowContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { buyNowItem, setBuyNowItem } = useBuyNow();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  /* ===============================
     CUSTOMER + SHIPPING FORM
  =============================== */
  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem("shippingAddress");

    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          email: "",
          phoneNumber: "",
          address: "",
          city: "",
          postalCode: "",
          country: "",
        };
  });

  /* ===============================
     FETCH CART (guest cookie based)
  =============================== */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/cart", {
          credentials: "include", // 🔥 IMPORTANT
        });

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid cart data");

        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!buyNowItem) fetchCart();
  }, [buyNowItem]);

  /* ===============================
     SAVE ADDRESS
  =============================== */
  useEffect(() => {
    localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  /* ===============================
     ITEMS FOR CHECKOUT
  =============================== */
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

  /* ===============================
     PLACE ORDER
  =============================== */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) return;

    setPlacingOrder(true);

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        credentials: "include", // 🔥 cookie cart
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderItems: checkoutItems.map((item) => ({
            product: item.product._id,
            qty: item.qty,
          })),
          shippingAddress,
          totalPrice,
        }),
      });

      const order = await res.json();

      if (!res.ok) throw new Error(order.message || "Order failed");

      // clear cart only if normal cart
      if (buyNowItem) {
        setBuyNowItem(null);
      } else {
        await fetch("http://localhost:5000/api/cart/clear", {
          method: "DELETE",
          credentials: "include",
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

  /* ===============================
     UI
  =============================== */
  if (loading) return <h2>Loading checkout…</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={submitHandler}>
        <h2>Customer Information</h2>

        <input
          required
          placeholder="Full Name"
          value={shippingAddress.name}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, name: e.target.value })
          }
        />

        <input
          required
          type="email"
          placeholder="Email Address"
          value={shippingAddress.email}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, email: e.target.value })
          }
        />

        <input
          required
          placeholder="Phone Number"
          value={shippingAddress.phoneNumber}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddress,
              phoneNumber: e.target.value,
            })
          }
        />

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

        <h2>Order Summary</h2>

        {checkoutItems.map((item) => (
          <div key={item.product._id} className="summary-item">
            <img
              src={`http://localhost:5000${item.product.image}`}
              alt={item.product.name}
            />
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

        <button type="submit" disabled={placingOrder}>
          {placingOrder ? "Placing Order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
