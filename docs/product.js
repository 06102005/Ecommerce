const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const price = params.get("price");
const image = params.get("image");

document.getElementById("name").innerText = name;
document.getElementById("price").innerText = price;
document.getElementById("image").src = image;

function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
