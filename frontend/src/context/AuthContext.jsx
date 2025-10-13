import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("tfc_user");
    return raw ? JSON.parse(raw) : null;
  });

  // LOGIN
  const login = async (email, password, role) => {
    const { data } = await api.post("/api/auth/login", { email, password, role });

    const token = data.data?.token || data.token;
    const userData = data.data?.user || data.user;

    if (!token || !userData) {
      throw new Error("Invalid login response format");
    }

    localStorage.setItem("tfc_token", token);
    localStorage.setItem("tfc_user", JSON.stringify(userData));
    setUser(userData);
    if (userData.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }

    return userData;
  };

  //SIGNUP
  const signup = async (name, email, password, role) => {
    const { data } = await api.post("/api/auth/signup", {
      name,
      email,
      password,
      role,  
    });

    const token = data.data?.token || data.token;
    const userData = data.data?.user || data.user;

    if (!token || !userData) {
      throw new Error("Invalid signup response format");
    }

    localStorage.setItem("tfc_token", token);
    localStorage.setItem("tfc_user", JSON.stringify(userData));
    setUser(userData);

    // redirect based on role
    if (userData.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }

    return userData;
  };

  //LOGOUT
  const logout = () => {
    localStorage.removeItem("tfc_token");
    localStorage.removeItem("tfc_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthCtx.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
