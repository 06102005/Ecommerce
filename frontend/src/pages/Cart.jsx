import { useEffect, useState } from "react";
import { useBuyNow } from "../context/BuyNowContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const MAX_QTY = 15;

const Cart = () => {
  const { setBuyNowItem } = useBuyNow();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    const res = await fetch("http://localhost:5000/api/cart", {
      credentials: "include",
    });

    const data = await res.json();
    setCartItems(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= UPDATE QTY ================= */
  const updateQty = async (productId, qty) => {
    if (qty < 1 || qty > MAX_QTY) return;

    await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ qty }),
    });

    fetchCart();
  };

  /* ================= REMOVE ================= */
  const removeItem = async (productId) => {
    await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchCart();
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-box">
        <h1>Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <img
                  src={`http://localhost:5000${item.product.image}`}
                  alt={item.product.name}
                />

                <div className="cart-details">
                  <h3>{item.product.name}</h3>
                  <p>₹{item.product.price}</p>

                  <div className="qty-controls">
                    <button
                      disabled={item.qty <= 1}
                      onClick={() =>
                        updateQty(item.product._id, item.qty - 1)
                      }
                    >
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button
                      disabled={item.qty >= MAX_QTY}
                      onClick={() =>
                        updateQty(item.product._id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <h2>Total: ₹{totalPrice}</h2>

            <button
              className="checkout-btn"
              onClick={() => {
                setBuyNowItem(null);
                navigate("/checkout");
              }}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
