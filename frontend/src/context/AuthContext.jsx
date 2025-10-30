import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ useNavigate
import api from "../api/axios";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("tfc_user");
    return raw ? JSON.parse(raw) : null;
  });

  const nav = useNavigate();  // ✅ init navigator

  // LOGIN
  const login = async (email, password, role) => {
    const { data } = await api.post("/api/auth/login", { email, password, role });

    const token = data.token;
    const userData = data.user;

    if (!token || !userData) {
      throw new Error("Invalid login response format");
    }

    localStorage.setItem("tfc_token", token);
    localStorage.setItem("tfc_user", JSON.stringify(userData));
    setUser(userData);

    // navigate without refresh
    nav(userData.role === "admin" ? "/admin" : "/dashboard");

    return userData;
  };

  // SIGNUP
  const signup = async (name, email, password, role) => {
    const { data } = await api.post("/api/auth/signup", {
      name,
      email,
      password,
      role,
    });

    const token = data.token;
    const userData = data.user;

    if (!token || !userData) {
      throw new Error("Invalid signup response format");
    }

    localStorage.setItem("tfc_token", token);
    localStorage.setItem("tfc_user", JSON.stringify(userData));
    setUser(userData);

    // navigate without refresh
    nav(userData.role === "admin" ? "/admin" : "/dashboard");

    return userData;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("tfc_token");
    localStorage.removeItem("tfc_user");
    setUser(null);

    nav("/login");   // ✅ navigate instead of reload
  };

  return (
    <AuthCtx.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
