import axios from "axios";

/**
 * Normalizes VITE_API_URL to: https://your-backend.up.railway.app/api
 * Handles: with/without /api, trailing slashes, accidental double /api
 */
export function normalizeApiBase(raw) {
  let base = (raw || "").trim().replace(/\/+$/, "");
  if (!base) return "";

  base = base.replace(/\/api\/api$/i, "/api");

  if (!base.toLowerCase().endsWith("/api")) {
    base = `${base}/api`;
  }

  return base;
}

export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

export function getApiUrl(path) {
  if (!API_BASE) return null;
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${endpoint}`;
}

const api = axios.create({
  baseURL: API_BASE || undefined,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (!API_BASE) {
    return Promise.reject(
      new Error(
        "API URL is not configured. Set VITE_API_URL on Railway and redeploy the client."
      )
    );
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
    const status = error.response?.status;
    const serverMsg = error.response?.data?.message;
    const triedUrl =
      error.config?.baseURL && error.config?.url
        ? `${error.config.baseURL}${error.config.url}`
        : error.config?.url;

    let message = serverMsg || error.message || "Request failed";

    if (status === 404) {
      message =
        serverMsg ||
        `API endpoint not found (404). Expected backend URL like https://your-server.up.railway.app/api — check VITE_API_URL on Railway and redeploy client.`;
    }

    const err = new Error(message);
    err.status = status;
    err.url = triedUrl;
    return Promise.reject(err);
  }
);

export default api;
