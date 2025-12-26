const userEmail = localStorage.getItem('loggedInUser');

if (!userEmail) {
  window.location.href = 'signin.html'; // redirect if not logged in
}

const user = JSON.parse(localStorage.getItem(userEmail));
document.getElementById('userName').innerText = user.fullName;

// Display orders
const ordersList = document.getElementById('ordersList');
if (user.orders.length === 0) {
  ordersList.innerHTML = '<li>No orders yet</li>';
} else {
  user.orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `${order.name} - ₹${order.price}`;
    ordersList.appendChild(li);
  });
}

// Display cart
const cartList = document.getElementById('cartList');
if (user.cart.length === 0) {
  cartList.innerHTML = '<li>Your cart is empty</li>';
} else {
  user.cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ₹${item.price}`;
    cartList.appendChild(li);
  });
}

// Logout button
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
});
window.location.href = 'signin.html';