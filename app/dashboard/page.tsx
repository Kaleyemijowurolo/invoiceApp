"use client";

import { useSession } from "next-auth/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "@/apiServices";
import FilterSection from "@/components/FilterSection";
import InvoiceList from "@/components/InvoiceList";
import ShimmerLoader from "@/shared/ShimmerLoader";
import styles from "../styles/Dashboard.module.scss";
import { useEffect, useMemo, useState, useRef } from "react";
import { Invoice, PaginatedInvoicesResponse } from "@/types";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const loadMoreRef = useRef<HTMLDivElement>(null); // Ref for the load more trigger

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<PaginatedInvoicesResponse>({
    queryKey: ["getAllInvoices"],
    queryFn: ({ pageParam = 1 }) =>
      apiService.getAllInvoices(pageParam as number, 10),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / 10);
      const nextPage = allPages?.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten the paginated data into a single array of invoices
  const allInvoices = useMemo(() => {
    return data?.pages.flatMap((page) => page.invoices) || [];
  }, [data]);

  const [filteredInvoices, setFilteredInvoices] =
    useState<Invoice[]>(allInvoices);

  useEffect(() => {
    setFilteredInvoices(allInvoices);
  }, [allInvoices]);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleFilterChange = (status: string[]) => {
    setSelectedStatuses(status);
  };

  // Apply client-side filtering
  const displayedInvoices = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return filteredInvoices;
    }
    return filteredInvoices.filter((invoice) =>
      selectedStatuses.includes(invoice.status)
    );
  }, [filteredInvoices, selectedStatuses]);

  // IntersectionObserver logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "20px", // Trigger 20px before the element is fully in view
        threshold: 1.0, // Trigger when 100% of the target is visible
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <ShimmerLoader />;
  if (error)
    return (
      <div className={styles.error}>Error: {(error as Error).message}</div>
    );

  return (
    <div className={styles.dashboard}>
      <FilterSection
        invoiceCount={data?.pages[0]?.total || 0}
        onFilterChange={handleFilterChange}
      />
      <br />
      <div className={styles.invoiceListContainer}>
        <InvoiceList
          totalItems={data?.pages[0]?.total || 0}
          isLoading={isLoading}
          invoices={displayedInvoices}
        />
        <div ref={loadMoreRef} style={{ height: "20px" }}>
          {isFetchingNextPage && <ShimmerLoader />}
          {!hasNextPage && displayedInvoices.length > 0 && (
            <p className={styles.noMore}>No more invoices to load</p>
          )}
        </div>
      </div>
    </div>
  );
}
