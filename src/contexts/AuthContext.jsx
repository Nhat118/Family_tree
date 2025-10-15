import React, { createContext, useContext, useState, useEffect } from "react";
import * as userService from "../services/userService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load user from localStorage (token workflow)
    const raw = localStorage.getItem("cgp_user");
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  async function login(email, password) {
    const res = await userService.login(email, password);
    if (res?.user) {
      setUser(res.user);
      localStorage.setItem("cgp_user", JSON.stringify(res.user));
    }
    return res;
  }
  function logout() {
    setUser(null);
    localStorage.removeItem("cgp_user");
  }

  async function register(payload) {
    return await userService.register(payload);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
