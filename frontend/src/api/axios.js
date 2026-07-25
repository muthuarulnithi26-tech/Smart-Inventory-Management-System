import axios from "axios";
import { sessionEvent } from "../utils/sessionEvent";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Only log request/response details in local development — this was
// previously always-on and leaking request payloads/headers to the
// browser console in production.
const isDev = import.meta.env.DEV;

api.interceptors.request.use((config) => {
  if (isDev) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data ?? "");
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
    if (isDev) {
      console.log("[API] Error:", error.response?.status, error.response?.data);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      sessionEvent.notify();
    }

    return Promise.reject(error);
  }
);

export default api;
