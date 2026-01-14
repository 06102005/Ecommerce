import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

  // 🔹 Fetch cart
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

        // Remove broken cart items safely
        setCartItems(data.filter(item => item.product));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCart();
  }, [user, navigate]);

  // 🔹 Update quantity (+ / -)
  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    try {
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

      if (!res.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCartItems(data.filter(item => item.product));
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Remove item
  const removeItem = async (productId) => {
    try {
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

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove item");
      }

      setCartItems(data.filter(item => item.product));
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );
  };

  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => {
            const stock = item.product.countInStock;

            const stockText =
              stock > 15
                ? "Book yours soon"
                : `${stock} left in stock`;

            return (
              <div
                key={item.product._id}
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "15px",
                }}
              >
                <img
                  src={`http://localhost:5000${item.product.image}`}
                  alt={item.product.name}
                  width="120"
                  style={{ objectFit: "cover" }}
                />

                <div style={{ flex: 1 }}>
                  <h3>{item.product.name}</h3>
                  <p>₹{item.product.price}</p>
                  <p style={{ color: "green" }}>{stockText}</p>

                  {/* Quantity controls */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      onClick={() =>
                        updateQty(item.product._id, item.qty - 1)
                      }
                    >
                      −
                    </button>

                    <span style={{ margin: "0 12px" }}>
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(item.product._id, item.qty + 1)
                      }
                      disabled={item.qty >= stock}
                    >
                      +
                    </button>
                  </div>

                  <p style={{ marginTop: "8px" }}>
                    Subtotal: ₹{item.product.price * item.qty}
                  </p>

                  <button
                    style={{ marginTop: "10px" }}
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* Cart total */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "2px solid black",
            }}
          >
            <h2>Total: ₹{getCartTotal()}</h2>

            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                marginTop: "10px",
              }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;








