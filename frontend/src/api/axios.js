import axios from "axios";
import { sessionEvent } from "../utils/sessionEvent";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
console.log("Axios Base URL:", api.defaults.baseURL);

// Debug interceptor
api.interceptors.request.use((config) => {
  console.log("Sending Request:", {
    url: config.baseURL + config.url,
    data: config.data,
    headers: config.headers,
  });

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionEvent.notify();
    }

    return Promise.reject(error);
  }
);

export default api;
