// Get logged-in user email
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
  alert("Please login first");
  window.location.href = "signin.html";
}

// Get user data
const user = JSON.parse(localStorage.getItem(loggedInUser));

// Show user details
document.getElementById("userName").innerText = user.name;
document.getElementById("userEmail").innerText = user.email;

// Show cart items
const cartList = document.getElementById("cartList");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  cartList.innerHTML = "<li>No items in cart</li>";
} else {
  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.name} - $${item.price}`;
    cartList.appendChild(li);
  });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
});
