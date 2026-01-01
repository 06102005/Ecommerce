let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartItems = document.getElementById("cartItems");
let total = 0;

cartItems.innerHTML = "";


cart.forEach((item, index) => {
  total += item.price * item.qty;

  cartItems.innerHTML += `
    <div class="cart-item">
      <img src="${item.image}">
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price} × ${item.qty}</p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    </div>
  `;
});

document.getElementById("cartTotal").innerText = total.toFixed(2);

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}
