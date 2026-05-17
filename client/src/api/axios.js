import axios from "axios";

/**
 * Normalizes VITE_API_URL so paths like /auth/signup resolve correctly.
 * Works whether env is "https://host" or "https://host/api" (no double /api).
 */
function getApiBaseUrl() {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (!raw) {
    console.warn("[API] VITE_API_URL is not set");
    return "";
  }
  let url = raw.replace(/\/+$/, "");
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  console.log("[API] Base URL:", url);
  return url;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("[API] Request:", config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network error — check API URL and CORS";
    console.error("[API] Error:", error.response?.status, message, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;
