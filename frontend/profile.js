// Check if user is logged in
const userEmail = localStorage.getItem('loggedInUser');
if (!userEmail) {
  window.location.href = 'signin.html'; // redirect if not logged in
}

// Get user data
let user = JSON.parse(localStorage.getItem(userEmail));

// Display user name
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

// Display certificates/cart
const certList = document.getElementById('certList');
function updateCertList() {
  certList.innerHTML = '';
  if (user.cart.length === 0) {
    certList.innerHTML = '<li>No certificates/items yet</li>';
  } else {
    user.cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item.name;
      // Add remove button for each item
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.marginLeft = '10px';
      removeBtn.onclick = () => {
        user.cart.splice(index, 1);
        localStorage.setItem(userEmail, JSON.stringify(user));
        updateCertList();
      };
      li.appendChild(removeBtn);
      certList.appendChild(li);
    });
  }
}
updateCertList();

// Add new certificate/item
document.getElementById('addCertBtn').addEventListener('click', () => {
  const newCert = document.getElementById('newCert').value.trim();
  if (newCert) {
    user.cart.push({ name: newCert });
    localStorage.setItem(userEmail, JSON.stringify(user));
    document.getElementById('newCert').value = '';
    updateCertList();
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
});
