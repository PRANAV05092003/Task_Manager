import axios from "axios";

export function getApiUrl(path) {
  const base = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
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
    const message =
      error.response?.data?.message ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;
