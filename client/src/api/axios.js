import axios from "axios";

/**
 * VITE_API_URL should be: https://your-backend.up.railway.app/api
 * Paths like /tasks become: .../api/tasks
 */
export function getApiUrl(path) {
  let base = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;

  if (!base.endsWith("/api")) {
    base = `${base}/api`;
  }

  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${base}${endpoint}`;
}

const api = axios.create({
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith("http")) {
    const fullUrl = getApiUrl(config.url);
    if (!fullUrl) {
      return Promise.reject(new Error("API URL is not configured"));
    }
    config.url = fullUrl;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMsg = error.response?.data?.message;
    const message = serverMsg || error.message || "Request failed";
    const err = new Error(message);
    err.status = status;
    return Promise.reject(err);
  }
);

export default api;
