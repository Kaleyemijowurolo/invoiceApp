"use client";

import { Invoice } from "@/types"; // Import the Invoice interface
import { useRouter } from "next/navigation";
import styles from "./InvoiceCard.module.scss";
import { useTheme } from "@/lib/context/ThemeContext";
import { StatusIcon } from "../icons/StatusIcons";

interface InvoiceCardProps {
  invoice: Invoice;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  const router = useRouter();

  const { darkMode } = useTheme();

  return (
    <div
      className={`${styles.invoiceCard} ${styles[invoice.status]} 
      ${styles[darkMode ? "dark-mode" : "light-mode"]}
      `}
      onClick={() => router.push(`dashboard/${invoice.id}`)}
    >
      <section className={styles.leftSection}>
        <span className={styles.id}>
          <span>#</span>
          {invoice.id}
        </span>
        <span className={styles.paymentDue}>
          Due{" "}
          {new Date(invoice.paymentDue).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className={styles.clientName}>{invoice.clientName}</span>
      </section>
      <section className={styles.rightSection}>
        <span className={styles.total}>£{invoice.total.toFixed(2)}</span>
        <span className={`${styles.status} ${styles[invoice.status]}`}>
          <StatusIcon status={invoice.status} />
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
        <span className={styles.arrow}>
          <svg
            width="7"
            height="10"
            viewBox="0 0 7 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L5 5L1 9" stroke="#7C5DFA" stroke-width="2" />
          </svg>
        </span>
      </section>
    </div>
  );
};

export default InvoiceCard;
