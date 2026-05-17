import axios from "axios";

/**
 * Builds full API URL: https://backend.up.railway.app/api/auth/signup
 * VITE_API_URL must be set at build time (Railway client env var).
 */
export function getApiUrl(path) {
  const base = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

  if (!base) {
    throw new Error(
      "VITE_API_URL is not set. Add it in Railway client variables and redeploy."
    );
  }

  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${base}${endpoint}`;
}

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith("http")) {
    config.url = getApiUrl(config.url);
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Request failed — check VITE_API_URL and redeploy client";
    return Promise.reject(new Error(message));
  }
);

export default api;
