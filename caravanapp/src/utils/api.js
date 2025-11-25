import axios from "axios";

const api = axios.create({
  baseURL: "", // The proxy in vite.config.js will handle this
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

export const getDashboardSummary = () => api.get("/api/dashboard/summary");

// Messaging
export const getConversations = () => api.get("/api/messaging");
export const getMessages = (conversationId) => api.get(`/api/messaging/${conversationId}/messages`);
export const sendMessage = (conversationId, text) => api.post(`/api/messaging/${conversationId}/messages`, { text });
export const findOrCreateConversation = (reservationId) => api.post(`/api/messaging/reservations/${reservationId}`);

// User
export const getMe = () => api.get("/api/users/me");

export default api;
