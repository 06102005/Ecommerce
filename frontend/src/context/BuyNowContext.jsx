import { createContext, useContext, useState } from "react";

const BuyNowContext = createContext();

export const BuyNowProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItem] = useState(null);

  return (
    <BuyNowContext.Provider value={{ buyNowItem, setBuyNowItem }}>
      {children}
    </BuyNowContext.Provider>
  );
};

export const useBuyNow = () => useContext(BuyNowContext);

