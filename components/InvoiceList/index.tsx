"use client";

import { Invoice } from "@/types";
import InvoiceCard from "../InvoiceCard";
import styles from "./InvoiceList.module.scss";
import InvoiceCardMobile from "../InvoiceCardMobile";
import React from "react";
import NoInvoiceIcon from "../icons/NoInvoiceIcon";

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading: boolean;
  totalItems: number;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  isLoading,
  totalItems,
}) => {
  console.log(invoices, "invoices in InvoiceList");

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.invoiceList}>
      {!isLoading && totalItems === 0 ? (
        <div className={styles.noInvoices}>
          <NoInvoiceIcon />
          <div>
            <p className={styles.nothingHere}>There is nothing here</p>
            <div className={styles.createInvoice}>
              <span>Create an invoice by clicking the </span>
              <span>
                <strong>New Invoice</strong> button and get started
              </span>
            </div>
          </div>
        </div>
      ) : (
        invoices.map((invoice) => (
          <React.Fragment key={invoice.id}>
            {isMobile ? (
              <InvoiceCardMobile invoice={invoice} />
            ) : (
              <InvoiceCard invoice={invoice} />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default InvoiceList;
