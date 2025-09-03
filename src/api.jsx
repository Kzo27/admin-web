// src/api/api.js
import axios from "axios";

// Vite automatically provides this variable.
// import.meta.env.PROD will be `true` when deployed online,
// and `false` when you run `npm run dev`.
const isProduction = import.meta.env.PROD;

const api = axios.create({
  // If online (production), the baseURL is set by Vercel.
  // If on your computer (development), the baseURL is empty ('/'),
  // which allows the Vite proxy to work.
  baseURL: isProduction ? import.meta.env.VITE_API_URL : "/",
});

// --- Your interceptors below this line do not need to be changed ---

// Interceptor to ADD the token (this is already correct)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to HANDLE response errors (this is already correct)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response &&
        error.response.data.message?.includes("token tidak valid"))
    ) {
      console.log("Session invalid or expired. Auto-logging out.");
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
