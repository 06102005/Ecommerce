const cart = JSON.parse(localStorage.getItem("cart")) || [];
const list = document.getElementById("cartItems");

if (cart.length === 0) {
  list.innerHTML = "<li>Cart is empty</li>";
}

cart.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.name} - $${item.price}`;
  list.appendChild(li);
});
