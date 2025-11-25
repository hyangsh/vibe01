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

export const getDashboardSummary = () => api.get("/dashboard/summary");

// Messaging
export const getConversations = () => api.get("/messaging");
export const getMessages = (conversationId) => api.get(`/messaging/${conversationId}/messages`);
export const sendMessage = (conversationId, text) => api.post(`/messaging/${conversationId}/messages`, { text });
export const findOrCreateConversation = (reservationId) => api.post(`/messaging/reservations/${reservationId}`);

// User
export const getMe = () => api.get("/users/me");

export default api;
