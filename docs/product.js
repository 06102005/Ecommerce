const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const price = parseFloat(params.get("price"));
const image = params.get("image");
const rating = params.get("rating") || "⭐⭐⭐⭐";
document.getElementById("productRating").innerText = rating;

const desc = params.get("desc");

document.getElementById("productName").innerText = name;
document.getElementById("productPrice").innerText = price;
document.getElementById("productImg").src = image;
document.getElementById("productDesc").innerText = desc;

let quantity = 1;
document.getElementById("totalPrice").innerText = price;

function changeQty(val) {
  quantity += val;
  if (quantity < 1) quantity = 1;

  document.getElementById("qty").innerText = quantity;
  document.getElementById("totalPrice").innerText =
    (price * quantity).toFixed(2);
}

function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({ name, price, image, qty: quantity });

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  alert("Product added to cart 🛒");
}
