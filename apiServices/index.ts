import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";
import { Invoice, PaginatedInvoicesResponse } from "@/types"; // Import the new interface
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

  getSingleInvoice: async (invoiceId: string) => {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data;
  },

  createInvoice: async (invoice: Invoice) => {
    const response = await api.post(`/invoices`, invoice);
    return response.data;
  },

  updateInvoice: async (invoiceId: string, invoice: Invoice) => {
    const response = await api.put(`/invoices/${invoiceId}`, invoice);
    return response.data;
  },

  updateInvoiceStatus: async (invoiceId: string) => {
    const response = await api.patch(`/invoices/${invoiceId}`);
    return response.data;
  },

  deleteInvoice: async (invoiceId: string) => {
    const response = await api.delete(`/invoices/${invoiceId}`);
    return response.data;
  },
};

// Export the configured Axios instance
const baseApi = api;
export default baseApi;
