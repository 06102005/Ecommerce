function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.innerText = count;
  }
}

updateCartCount();
