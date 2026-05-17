import axios from "axios";

// VITE_API_URL must be: https://your-backend.up.railway.app/api  (ONLY ONE /api)
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

if (!API_URL) {
  console.error("[API] VITE_API_URL is not set");
} else {
  console.log("[API] Base URL:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Final URL = VITE_API_URL + /auth/signup  →  .../api/auth/signup
  console.log("[API] Request:", config.method?.toUpperCase(), `${API_URL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "[API] Error:",
      error.response?.status,
      error.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);

export default api;
