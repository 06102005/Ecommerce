// Get cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Dummy user id (replace with real user after auth)
const USER_ID = "64a000000000000000000001"; // sample ObjectId

async function createOrder() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    const response = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: USER_ID,
        items: cart,
        totalAmount
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order created successfully");
      updatePaymentStatus(data.order._id, "Paid");
      localStorage.removeItem("cart");
    } else {
      alert("Order creation failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
}

async function updatePaymentStatus(orderId, status) {
  try {
    await fetch("http://localhost:5000/api/payment/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        orderId,
        status
      })
    });
  } catch (error) {
    console.error(error);
  }
}
