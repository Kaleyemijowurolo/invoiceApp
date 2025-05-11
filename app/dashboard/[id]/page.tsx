import { notFound } from "next/navigation";
import InvoiceDetails from "@/components/InvoiceDetails";

export default function InvoiceDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Simulate fetching invoice by ID (replace with real data fetching logic)
  const invoiceId = params.id;
  if (invoiceId !== "XM9141") {
    notFound(); // Return 404 if invoice not found
  }

  return <InvoiceDetails id={invoiceId} />;
}
