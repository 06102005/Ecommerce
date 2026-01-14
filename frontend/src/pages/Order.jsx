import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Order = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch order");
        }

        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  if (loading) return <h2>Loading order...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Order Details</h1>

      <p><strong>Order ID:</strong> {order._id}</p>

      <h3>Shipping Address</h3>
      <p>
        {order.shippingAddress.address},{" "}
        {order.shippingAddress.city},{" "}
        {order.shippingAddress.postalCode},{" "}
        {order.shippingAddress.country}
      </p>

      <h3>Payment Method</h3>
      <p>{order.paymentMethod}</p>

      <h3>Order Items</h3>

      {order.orderItems.map(item => (
        <div
          key={item.product}
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "15px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
          }}
        >
          <img
  src={`http://localhost:5000${item.image}`}
  alt={item.name}
  width="80"
/>

          <div>
            <p>{item.name}</p>
            <p>
              {item.qty} × ₹{item.price} = ₹{item.qty * item.price}
            </p>
          </div>
        </div>
      ))}

      <h2>Total: ₹{order.totalPrice}</h2>
    </div>
  );
};

export default Order;
