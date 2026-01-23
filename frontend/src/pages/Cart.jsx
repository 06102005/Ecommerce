import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

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

        setCartItems(data.filter((item) => item.product));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    const res = await fetch(
      `http://localhost:5000/api/cart/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ qty }),
      }
    );

    const data = await res.json();
    setCartItems(data.filter((item) => item.product));
  };

  const removeItem = async (productId) => {
    const res = await fetch(
      `http://localhost:5000/api/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const data = await res.json();
    setCartItems(data.filter((item) => item.product));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  if (error) return <h2>{error}</h2>;

  return (
    <div className="cart-container">
      <div className="cart-box">
        <h1>Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const stock = item.product.stock;

<p className="stock">
  {stock > 0 ? `${stock} in stock` : "Out of stock"}
</p>

              return (
                <div key={item.product._id} className="cart-item">
                  <img
                    src={`http://localhost:5000${item.product.image}`}
                    alt={item.product.name}
                  />

                  <div className="cart-details">
                    <h3>{item.product.name}</h3>
                    <p>₹{item.product.price}</p>
                    <p className="stock">{stock}</p>

                    <div className="qty-controls">
                      <button
                        onClick={() =>
                          updateQty(
                            item.product._id,
                            item.qty - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>{item.qty}</span>

                     <button
  disabled={stock === 0 || item.qty >= stock}
  onClick={() => updateQty(item.product._id, item.qty + 1)}
>
  +
</button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() =>
                        removeItem(item.product._id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <h2>Total: ₹{totalPrice}</h2>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
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