import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Order.css";

const Order = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`);
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
  }, [id]);

  if (loading) return <h2>Loading order…</h2>;
  if (error) return <h2>{error}</h2>;
  if (!order) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>Order Placed Successfully 🎉</h1>

      <h3>Order ID: {order._id}</h3>

      <h2>Customer Info</h2>
      <p>Name: {order.shippingAddress.name}</p>
      <p>Email: {order.shippingAddress.email}</p>
      <p>Phone: {order.shippingAddress.phoneNumber}</p>

      <h2>Shipping Address</h2>
      <p>
        {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
        {order.shippingAddress.postalCode}, {order.shippingAddress.country}
      </p>

      <h2>Items</h2>
      {order.orderItems.map((item) => (
        <div key={item.product} style={{ marginBottom: 10 }}>
          <img
            src={`http://localhost:5000${item.image}`}
            alt={item.name}
            width={60}
          />
          <span>
            {item.name} × {item.qty} = ₹{item.price * item.qty}
          </span>
        </div>
      ))}

      <h2>Total: ₹{order.totalPrice}</h2>
    </div>
  );
};

export default Order;
