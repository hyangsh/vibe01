import axios from "axios";

const api = axios.create({
  baseURL: "/api", // The proxy in vite.config.js will handle this
  headers: {
    "Content-Type": "application/json",
  },
});

/*
  Intercepts every request and checks for a token in localStorage.
  If a token is found, it adds it to the 'x-auth-token' header.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
