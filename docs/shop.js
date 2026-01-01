function openProduct(name, price, image, rating) {
  window.location.href =
    `product.html?name=${encodeURIComponent(name)}
    &price=${price}
    &image=${encodeURIComponent(image)}
    &rating=${encodeURIComponent(rating)}`;
}
