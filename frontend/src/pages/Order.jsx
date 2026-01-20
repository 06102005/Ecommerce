import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Order.css";

const Order = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) return;

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
        if (!res.ok) throw new Error(data.message);

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  if (loading) return <h2 className="loading">Loading order…</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!order) return <h2 className="error">Order not found</h2>;

  return (
    <div className="order-container">
      <h1>Order Details</h1>

      <div className="order-box">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

        <div className="status-row">
          <span className={`status ${order.isPaid ? "paid" : "pending"}`}>
            {order.isPaid ? "Paid" : "Not Paid"}
          </span>
          <span className={`status ${order.isDelivered ? "delivered" : "pending"}`}>
            {order.isDelivered ? "Delivered" : "Not Delivered"}
          </span>
        </div>
      </div>

      <div className="order-box">
        <h2>Shipping Address</h2>
        <p>{order.shippingAddress.address}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
        <p>{order.shippingAddress.country}</p>
      </div>

      <div className="order-box">
        <h2>Order Items</h2>

        {order.orderItems.map((item) => {
          const product = item.product || {};

          return (
            <div key={item._id} className="order-item">
              <img
                src={
                  product.image
                    ? `http://localhost:5000${product.image}`
                    : "/placeholder.png"
                }
                alt={product.name || "Product"}
                onError={(e) => (e.target.src = "/placeholder.png")}
              />

              <div className="order-item-info">
                {product._id ? (
                  <Link to={`/product/${product._id}`} className="product-link">
                    {product.name}
                  </Link>
                ) : (
                  <p className="product-link">Product unavailable</p>
                )}

                <p>{item.qty} × ₹{item.price}</p>
                <p className="item-total">₹{item.qty * item.price}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="order-total">
        Total: ₹{order.totalPrice}
      </div>
    </div>
  );
};

export default Order;



