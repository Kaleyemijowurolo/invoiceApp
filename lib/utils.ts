import Invoice from "@/models/Invoice";
import { v4 as uuidv4 } from "uuid";

// Generate unique invoice ID in format XX1234 (e.g., RG0314)
export const generateInvoiceId = async (): Promise<string> => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const maxRetries = 10; // Increased for better reliability

  for (let i = 0; i < maxRetries; i++) {
    const uuid = uuidv4().replace(/-/g, ""); // Generate a new UUID
    const seed = parseInt(uuid.slice(0, 8), 16); // First 8 hex chars as seed

    // Validate seed
    if (isNaN(seed)) {
      console.warn("Invalid seed generated, retrying...", uuid.slice(0, 8));
      continue;
    }

    // Generate two distinct random indices using seed
    const randomIndex1 = seed % 26; // First letter index
    let randomIndex2 = (((seed >> 8) % 26) + (seed % 13)) % 26; // Second letter index with variation

    // Ensure indices are within bounds
    // randomIndex1 = Math.max(0, Math.min(25, randomIndex1));
    randomIndex2 = Math.max(0, Math.min(25, randomIndex2));

    const randomDigits = (seed % 10000).toString().padStart(4, "0"); // 0000-9999

    const id = letters[randomIndex1] + letters[randomIndex2] + randomDigits;

    console.log(
      `Attempt ${
        i + 1
      }: Seed=${seed}, Index1=${randomIndex1}, Index2=${randomIndex2}, ID=${id}`
    ); // Debug

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
