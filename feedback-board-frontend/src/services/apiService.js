import axios from "axios";
import router from "@/router";
import { useToast } from 'vue-toastification'

const toast = useToast()

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ensures cookies get sent & received
});

let isRefreshing = false;
let failedQueue = [];

// used to prevent calling the refresh multiple times
function processQueue(error) {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve();
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Ask backend to refresh cookie
        await api.post("/auth/refresh", {}, { withCredentials: true });

        processQueue(null);
        return api(originalRequest); // retry
      } catch (err) {
        processQueue(err);
        router.push({name: 'Auth'})
        toast.error('Invalid username or password!', {
          timeout: 2000,
        })
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
