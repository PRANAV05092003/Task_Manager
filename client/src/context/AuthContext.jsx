import { createContext, useContext, useState, useEffect } from "react";
import api, { API_BASE } from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    if (!API_BASE) {
      throw new Error("API URL is not configured. Redeploy client with VITE_API_URL set.");
    }

    const { data } = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    if (!data?.token) {
      throw new Error("Invalid response from server — no token received");
    }

    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const signup = async (name, email, password) => {
    if (!API_BASE) {
      throw new Error("API URL is not configured. Redeploy client with VITE_API_URL set.");
    }

    const { data } = await api.post("/auth/signup", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (!data?.token) {
      throw new Error("Invalid response from server — no token received");
    }

    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, apiBase: API_BASE }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
