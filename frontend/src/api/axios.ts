import axios from "axios";

/* ==============================
   API HELPERS
================================ */
export const apiHelpers = {
  getCurrentUser: () => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: any) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  },
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Is this a 401 Unauthorized?
    // And have we not already tried to retry this request?
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");

      // Check if we have a refresh token
      // AND ensure the failed request wasn't the refresh request itself
      // (Refresh endpoint is "auth/refresh/", so we should avoid loop if that fails)
      const isRefreshRequest = originalRequest.url.includes("auth/refresh/");

      if (refreshToken && !isRefreshRequest) {
        try {
          // Attempt to refresh token
          // Note: Use axios directly to avoid interceptors loop
          // The refresh endpoint is relative to the API base URL? Assuming standard:
          // http://localhost:8000/api/auth/refresh/
          const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";
          const response = await axios.post(`${baseURL}auth/refresh/`, {
            refresh: refreshToken,
          });

          // Save new access token
          const newAccessToken = response.data.access;
          localStorage.setItem("access", newAccessToken);

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, let's logout
          console.error("Token refresh failed:", refreshError);
          apiHelpers.logout();
        }
      } else {
        // No refresh token available, or the refresh itself failed (should be caught above, but safety first)
        apiHelpers.logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
