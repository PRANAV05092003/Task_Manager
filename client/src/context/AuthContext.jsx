import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("[Auth] Session check failed:", err.response?.data?.message);
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log("[Auth] Login attempt:", email);
    const { data } = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const signup = async (name, email, password) => {
    console.log("[Auth] Signup attempt:", email);
    const { data } = await api.post("/auth/signup", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    localStorage.setItem("token", data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
