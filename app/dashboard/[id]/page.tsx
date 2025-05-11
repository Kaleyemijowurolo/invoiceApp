// "use client";
// import { apiService } from "@/apiServices";
// import InvoiceDetails from "@/components/InvoiceDetails";
// import { useQuery } from "@tanstack/react-query";

// export default function InvoiceDetailsPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   // Simulate fetching invoice by ID (replace with real data fetching logic)
//   const { id: invoiceId } = params;

//   const { data, isLoading } = useQuery({
//     queryKey: ["getSingleInvoice", invoiceId],
//     queryFn: () => apiService.getSingleInvoice(invoiceId),
//     enabled: !!invoiceId,
//   });

//   console.log(data.invoice, "data");

//   console.log(invoiceId, "invoiceid");
//   if (isLoading) {
//     return <div>loading...</div>;
//   }

//   return <InvoiceDetails invoice={data?.invoice} />;
// }

import { notFound } from "next/navigation";
import serverApiService from "@/apiServices/server";
import InvoiceDetails from "@/components/InvoiceDetails";

export default async function InvoiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: invoiceId } = await params;
  try {
    const d = await serverApiService.getSingleInvoice(invoiceId);
    return <InvoiceDetails invoice={d?.invoice} />;
  } catch (error) {
    console.error(`Failed to fetch invoice with ID ${invoiceId}:`, error);
    notFound();
  }
}
