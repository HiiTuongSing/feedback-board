import axios from "axios";
import router from "@/router";
import { useToast } from "vue-toastification";

const toast = useToast();

const api = axios.create({
  baseURL: "http://localhost:3001/api/",
  withCredentials: true,
});

// IMPORTANT: separate instance for refresh to avoid interceptor loop
const refreshApi = axios.create({
  baseURL: "http://localhost:3001/api/",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    // handle expired/invalid auth
    if ([401, 403].includes(status) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refresh token (cookie-based)
        await refreshApi.post("/auth/refresh");

        processQueue(null);

        return api(originalRequest);
      } catch (err) {
        processQueue(err);

        toast.error("Session expired. Please login again.", {
          timeout: 2000,
        });

        router.push({ name: "Auth" });

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;