const cartItems = document.getElementById("cartItems");

// Check if user is logged in
if (!localStorage.getItem('loggedInUser')) {
  window.location.href = 'signin.html';
}

// LOAD CART
function loadCart() {
  fetch("http://localhost:5000/api/cart")
    .then(res => res.json())
    .then(data => {
      cartItems.innerHTML = "";
      data.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.name} - ₹${item.price} 
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
          <button onclick="removeItem(${index})">Remove</button>
        `;
        cartItems.appendChild(li);
      });
    });
}

loadCart();

// UPDATE QUANTITY
function updateQuantity(index, change) {
  fetch(`http://localhost:5000/api/cart/update/${index}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ change })
  })
  .then(() => loadCart());
}

// REMOVE ITEM
function removeItem(index) {
  fetch(`http://localhost:5000/api/cart/remove/${index}`, {
    method: "DELETE"
  })
  .then(() => loadCart());
}

// CHECKOUT
document.getElementById("checkoutBtn").addEventListener("click", () => {
  createOrder();
});

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
