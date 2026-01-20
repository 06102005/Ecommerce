import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BuyNowProvider } from "./context/BuyNowContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BuyNowProvider>
        <App />
      </BuyNowProvider>
    </AuthProvider>
  </React.StrictMode>
);


