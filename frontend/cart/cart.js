const cartItems = document.getElementById("cartItems");

// LOAD CART
fetch("http://localhost:5000/api/cart")
  .then(res => res.json())
  .then(data => {
    cartItems.innerHTML = "";
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ₹${item.price} x ${item.qty}`;
      cartItems.appendChild(li);
    });
  });

// CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {
  createOrder();
});
    window.location.href = 'signin.html';
function createOrder() {
  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userEmail: localStorage.getItem('loggedInUser') })
  })
    .then(res => res.json())
    .then(order => {
      alert(`Order ${order.id} created successfully!`);
      // Clear cart after order creation
        fetch("http://localhost:5000/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userEmail: localStorage.getItem('loggedInUser') })
      })
        .then(() => { 
            cartItems.innerHTML = "";
        });
    });
}
