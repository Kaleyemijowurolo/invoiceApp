import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";
import { PaginatedInvoicesResponse } from "@/types"; // Import the new interface
// Define your base URL for API requests within Next.js
const api: AxiosInstance = axios.create({
  baseURL: "/api", // Next.js API routes
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Login
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data, {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    });
    return response.data;
  },

  // Signup
  signup: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<PaginatedInvoicesResponse> => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  getAllInvoices: async (page: number = 1, limit: number = 10) => {
    const config: AxiosRequestConfig = {
      headers: {},
      params: { page, limit }, // Add pagination params
    };
    const response = await api.get("/invoices", config);
    return response.data;
  },
};

// Export the configured Axios instance
const baseApi = api;
export default baseApi;

// import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./app/api/auth/[...nextauth]/route"; // Adjust the path as needed

// // Define your base URL for API requests within Next.js
// const api: AxiosInstance = axios.create({
//   baseURL: "/api", // Next.js API routes
//   timeout: 60000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor to include the session token in headers
// api.interceptors.request.use(
//   async (config: AxiosRequestConfig) => {
//     const session = await getServerSession(authOptions);
//     if (session?.token?.id) {
//       config.headers.Authorization = `Bearer ${session.token.id}`; // Use JWT token from session
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // API service with server-side session handling
// export const apiService = {
//   // Login (client-side, uses NextAuth.js credentials flow)
//   login: async (data: { email: string; password: string }) => {
//     const response = await api.post("/auth/login", data, {
//       baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Use external base URL for login if needed
//     });
//     return response.data;
//   },

//   // Signup (client-side)
//   signup: async (data: { email: string; password: string; name: string }) => {
//     const response = await api.post("/auth/signup", data);
//     return response.data;
//   },

//   // Get all invoices (server-side, uses session)
//   getAllInvoices: async (session?: Awaited<ReturnType<typeof getServerSession>>) => {
//     const config: AxiosRequestConfig = {
//       headers: {},
//     };
//     if (session?.access_token) {
//       config.headers.Authorization = `Bearer ${session.access_token}`;
//     }
//     const response = await api.get("/invoices", config); // Updated to match your API endpoint
//     return response.data;
//   },
// };

// // Export the configured Axios instance
// const baseApi = api;
// export default baseApi;
