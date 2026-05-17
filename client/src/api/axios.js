import axios from "axios";

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
