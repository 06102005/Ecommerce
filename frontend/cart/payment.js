function createOrder() {
  fetch("http://localhost:5000/api/payment/checkout", {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      alert("Order placed successfully!");

      // clear cart UI (optional)
      const cartItems = document.getElementById("cartItems");
      if (cartItems) {
        cartItems.innerHTML = "";
      }
    })
    .catch(err => {
      console.error("Error during payment:", err);
      alert("Payment failed. Please try again.");
    });
}

// PAY BUTTON CLICK
document.getElementById("payBtn").addEventListener("click", () => {
  createOrder();
});
