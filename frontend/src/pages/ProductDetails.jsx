import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBuyNow } from "../context/BuyNowContext";
import "./ProductDetails.css";

const MAX_QTY = 15;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBuyNowItem } = useBuyNow();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(setProduct);
  }, [id]);

  if (!product) return null;

  const inStock = product.countInStock > 0;

  const addToCartHandler = async () => {
  await fetch("http://localhost:5000/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      productId: product._id,
      qty,
    }),
  });

  navigate("/cart");
};


  const buyNowHandler = () => {
    setBuyNowItem({ product, qty });
    navigate("/checkout");
  };

  return (
    <div className="product-page">
      <div className="product-card">
        <img 
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
        />

        <h1>{product.name}</h1>
        <h2>₹{product.price}</h2>

        <p className={`stock ${inStock ? "in" : "out"}`}>
          {inStock ? "In stock" : "Out of stock"}
        </p>

        <p className="description">{product.description}</p>

        <div className="qty-controls">
          <button disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button>
          <span>{qty}</span>
          <button disabled={qty >= MAX_QTY} onClick={() => setQty(qty + 1)}>+</button>
        </div>

       <div className="button-row">
        <button className="add-cart-btn" disabled={!inStock} onClick={addToCartHandler}>
          Add to Cart
        </button>

        <button className="buy-btn" disabled={!inStock} onClick={buyNowHandler}>
          Buy Now
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
