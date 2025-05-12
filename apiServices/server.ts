// Server-side API utility for SSR with NextAuth
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

// Base configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // Use absolute URL
const TIMEOUT = 60000; // 60 seconds timeout

// Utility to fetch token from session
async function getAuthToken() {
  const session = await getServerSession(options);
  // Assuming the token is stored in session.accessToken (adjust based on your setup)
  return session?.access_token || null;
}

// Utility to create headers with optional token
const getHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Base fetch wrapper with token handling
async function baseFetch(
  url: string,
  options: RequestInit = {},
  customBaseUrl?: string
) {
  const token = await getAuthToken(); // Fetch token from session
  const fullUrl = `${customBaseUrl || BASE_URL}${
    url.startsWith("/") ? url : "/" + url
  }`;

  // Add timeout with AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...getHeaders(token),
        ...options.headers, // Allow overriding headers if provided
      },
      signal: controller.signal,
      next: { revalidate: 0 }, // Disable caching by default for SSR
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// API service methods for SSR
export const serverApiService = {
  getAllInvoice: async () => {
    return baseFetch("/invoices");
  },
  getSingleInvoice: async (invoiceId: string) => {
    return baseFetch(`/invoices/${invoiceId}`);
  },
};

// Export base fetch utility if needed
export const baseApi = { fetch: baseFetch };
export default serverApiService;
