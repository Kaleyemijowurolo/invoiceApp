import axios, { AxiosInstance } from "axios";

// Define your base URL for API requests within Next.js
const api: AxiosInstance = axios.create({
  baseURL: "/api", // Next.js API routes
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Login
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data, {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    });
    return response.data;
  },

  // Signup
  signup: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },
};

// Export the configured Axios instance
const baseApi = api;
export default baseApi;
