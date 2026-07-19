import axios from "axios";
import { sessionEvent } from "../utils/sessionEvent";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
console.log("Axios Base URL:", api.defaults.baseURL);

// Debug interceptor
api.interceptors.request.use((config) => {
  console.log("================================");
  console.log("URL:", config.baseURL + config.url);
  console.log("METHOD:", config.method);
  console.log("DATA:", JSON.stringify(config.data));
  console.log("HEADERS:", config.headers);
  console.log("================================");

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => {
    console.log("✅ Axios Success:", response);
    return response;
  },

  (error) => {
    console.log("❌ Axios Error:", error);
    console.log("❌ Response:", error.response);
    console.log("❌ Message:", error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionEvent.notify();
    }

    return Promise.reject(error);
  }
);

export default api;
