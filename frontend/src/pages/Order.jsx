import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Order.css";

const Order = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load order");

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  if (loading) return <h2 className="loading">Loading order...</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!order) return <h2>Order not found</h2>;

  return (
    <div className="order-container">
      <h1>Order Details</h1>

      <div className="order-box">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={order.isPaid ? "paid" : "not-paid"}>
            {order.isPaid ? "Paid" : "Not Paid"}
          </span>
        </p>
      </div>

      <div className="order-box">
        <h2>Shipping Address</h2>
        <p>{order.shippingAddress.address}</p>
        <p>
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>

      <div className="order-box">
        <h2>Order Items</h2>

        {order.orderItems.map((item, index) => (
          <div key={index} className="order-item">
            <img
              src={
                item.image
                  ? `http://localhost:5000${item.image}`
                  : "/placeholder.png"
              }
              alt={item.name}
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />

            <div className="order-item-info">
              <p className="name">{item.name}</p>
              <p>
                {item.qty} × ₹{item.price}
              </p>
              <p className="item-total">
                ₹{item.qty * item.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-total">
        <h2>Total: ₹{order.totalPrice}</h2>
      </div>
    </div>
  );
};

export default Order;

