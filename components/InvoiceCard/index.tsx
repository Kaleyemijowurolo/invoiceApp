"use client";

import { useRouter } from "next/navigation";
import { Invoice } from "@/types"; // Import the Invoice interface
import styles from "./InvoiceCard.module.scss";

interface InvoiceCardProps {
  invoice: Invoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const router = useRouter();

  return (
    <div
      className={`${styles.invoiceCard} ${styles[invoice.status]}`}
      onClick={() => router.push(`/invoice/${invoice.id}`)}
    >
      <span className={styles.id}>#{invoice.id}</span>
      <span className={styles.clientName}>{invoice.clientName}</span>
      <span className={styles.total}>£{invoice.total.toFixed(2)}</span>
      <span className={`${styles.status} ${styles[invoice.status]}`}>
        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
      </span>
      <span className={styles.paymentDue}>
        Due{" "}
        {new Date(invoice.paymentDue).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>
  );
};

export default InvoiceCard;
