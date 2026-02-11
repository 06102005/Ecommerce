import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BuyNowProvider } from "./context/BuyNowContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BuyNowProvider>
      <App />
    </BuyNowProvider>
  </React.StrictMode>
);
