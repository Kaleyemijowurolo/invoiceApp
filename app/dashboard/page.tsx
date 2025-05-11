"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/apiServices";
import FilterSection from "@/components/FilterSection";
import InvoiceList from "@/components/InvoiceList";
import ShimmerLoader from "@/components/ShimmerLoader";
import styles from "./Dashboard.module.scss";
import { useEffect, useMemo, useState } from "react";
import { Invoice, PaginatedInvoicesResponse } from "@/types";

export default function Dashboard() {
  const { data: session, status } = useSession();
  // const { data: session, status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     window.location.href = "/auth/signin";
  //   },
  // });

  const { data, isLoading, error } = useQuery<PaginatedInvoicesResponse>({
    queryKey: ["invoices"],
    queryFn: () => apiService.getAllInvoices(),
    // enabled: status === "authenticated",
    // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  console.log(data, "invoices in db");

  const invoices = data?.invoices || [];

  console.log(invoices, "invoices var");

  const [initialInvoices, setFilteredInvoices] = useState<Invoice[]>(
    data?.invoices || []
  );

  useEffect(() => {
    if (data) {
      setFilteredInvoices(data.invoices);
    }
  }, [data?.invoices]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleFilterChange = (status: string[]) => {
    setSelectedStatuses(status); // Update the selected statuses state
  };

  // Memoize filteredInvoices to avoid unnecessary recalculations
  const filteredInvoices = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return initialInvoices; // Return all invoices if no filters are selected
    }
    return initialInvoices.filter((invoice) =>
      selectedStatuses.includes(invoice.status)
    );
  }, [initialInvoices, selectedStatuses]);

  console.log(filteredInvoices, "filteredInvoices");
  // const handleFilterChange = (status: string[]) => {
  //   if (status.length === 0) {
  //     setFilteredInvoices(invoices); // Show all invoices if no filters
  //   } else {
  //     setFilteredInvoices(
  //       invoices.filter((invoice) => status.includes(invoice.status))
  //     );
  //   }
  // };

  if (
    status === "loading" ||
    isLoading
    // ||
    // (!error && filteredInvoices?.length === 0)
  )
    return <ShimmerLoader />;
  if (error)
    return (
      <div className={styles.error}>Error: {(error as Error).message}</div>
    );

  return (
    <div className={styles.dashboard}>
      <FilterSection
        invoiceCount={data?.total || 0}
        onFilterChange={handleFilterChange}
      />
      <br />

      <InvoiceList isLoading={isLoading} invoices={filteredInvoices} />
    </div>
  );
}
