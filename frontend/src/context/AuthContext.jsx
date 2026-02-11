import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("adminInfo"))
  );

  const login = (data) => {
    localStorage.setItem("adminInfo", JSON.stringify(data));
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem("adminInfo");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
