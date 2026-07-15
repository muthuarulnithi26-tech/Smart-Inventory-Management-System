import axios from "axios";
import { sessionEvent } from "../utils/sessionEvent";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// import { sessionEvent } from "../utils/sessionEvent";

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // trigger session expired globally
      sessionEvent.notify();
    }

    return Promise.reject(error);
  }
);
export default api;
