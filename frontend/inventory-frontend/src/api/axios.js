// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Track which backend is active
let usingFallback = false;

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // If on fallback JSON Server, strip /api prefix
    // since json-server uses /products not /api/products
    if (usingFallback) {
      config.baseURL = "http://localhost:3001";
      config.url = config.url.replace("/api", "");
    }

    return config;
  },
  (err) => Promise.reject(err),
);

API.interceptors.response.use(
  (res) => {
    usingFallback = false; // Flask is responding
    return res;
  },
  async (err) => {
    // Flask is down → switch to JSON Server
    if (
      !usingFallback &&
      (err.code === "ECONNREFUSED" || err.response?.status === 502)
    ) {
      console.warn("⚠️ Flask down, switching to JSON Server (db.json)");
      usingFallback = true;

      // Retry the request on JSON Server
      const config = err.config;
      config.baseURL = "http://localhost:3001";
      config.url = config.url.replace("/api", "");
      return API(config);
    }

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  },
);

export default API;
