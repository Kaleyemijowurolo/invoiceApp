// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";
import Invoice from "@/models/Invoice";
import { v4 as uuidv4 } from "uuid";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// =================================================

// Generate unique invoice ID in format XX1234 (e.g., RG0314)
export const generateInvoiceId = async (): Promise<string> => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const maxRetries = 10; // Increased for better reliability

  for (let i = 0; i < maxRetries; i++) {
    const uuid = uuidv4().replace(/-/g, ""); // New UUID each retry
    const seed = parseInt(uuid.slice(0, 8), 16);
    const randomIndex1 = seed % 26;
    const randomIndex2 = (seed >> 4) % 26;
    const randomDigits = (seed % 10000).toString().padStart(4, "0"); // 0000-9999

    const id = letters[randomIndex1] + letters[randomIndex2] + randomDigits;

    // Check if ID is unique
    const existingInvoice = await Invoice.findOne({ id });
    if (!existingInvoice) {
      return id;
    }
  }

  throw new Error(
    "Failed to generate unique invoice ID after multiple attempts"
  );
};

export function truncateText(text: string, maxLength: number) {
  if (text?.length <= maxLength) return text;
  return text?.slice(0, maxLength) + "...";
}

// =================================================

export function generateYearsArray(startYear: number) {
  const currentYear = new Date().getFullYear(); // Get the current year
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  ); // Generate the years array and stringify the items
}

// =================================================

export default function generateUniqueReferralCode() {
  return uuidv4().split("-")[0]; // Shorten UUID
}

// =================================================

export const formatDate = (dateString: string, showTime?: boolean) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
    day: "numeric", // Added day to the formatting options
  };

  // Conditionally add time formatting options
  if (showTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("en-US", options)?.format(date);
};

export const formatCurrency = (
  amount: number,
  currency: string = "NGN",
  locale: string = "en-US"
) => {
  // Check if amount is not a number or is undefined/null
  if (amount == null || isNaN(amount)) return ""; // Return empty string if no valid amount is provided

  // Ensure 0 is properly formatted
  return new Intl.NumberFormat(locale, {
    style: "currency",
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
    currency,
  }).format(amount);
};

// =================================================
export function cleanName(name: string) {
  return name
    .replace(/\bundefined\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
