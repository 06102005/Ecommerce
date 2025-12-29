// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsDiv = document.getElementById("cart-items");
const totalPriceSpan = document.getElementById("total-price");

// Display cart items
function displayCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
    totalPriceSpan.innerText = 0;
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.innerHTML = `
      <p>
        <strong>${item.name}</strong><br>
        Price: ₹${item.price} <br>
        Quantity: ${item.quantity}
      </p>
      <hr>
    `;
    cartItemsDiv.appendChild(div);
  });

  totalPriceSpan.innerText = total;
}

// Checkout button
document.getElementById("checkoutBtn").addEventListener("click", () => {
  createOrder();
});

// Load cart on page load
displayCart();
