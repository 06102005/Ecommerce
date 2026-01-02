const items = JSON.parse(localStorage.getItem("buyNowItem")) || [];
const container = document.getElementById("checkoutItems");
const totalEl = document.getElementById("checkoutTotal");

let total = 0;

items.forEach(item => {
  total += item.price * item.qty;

  container.innerHTML += `
    <div class="cart-item">
      <img src="${item.image}">
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price} × ${item.qty}</p>
      </div>
    </div>
  `;
});

totalEl.innerText = total.toFixed(2);

function placeOrder() {
  alert("Order placed successfully 🎉");
  localStorage.removeItem("buyNowItem");
  window.location.href = "shop.html";
}
