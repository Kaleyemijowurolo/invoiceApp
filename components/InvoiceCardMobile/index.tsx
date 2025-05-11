"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import { Invoice } from "@/types";
import styles from "./InvoiceCardMobile.module.scss";
import { useRouter } from "next/navigation";
import { StatusIcon } from "../icons/StatusIcons";

interface InvoiceCardMobileProps {
  invoice: Invoice;
}

const InvoiceCardMobile: React.FC<InvoiceCardMobileProps> = ({ invoice }) => {
  const router = useRouter();
  const { darkMode } = useTheme();

  return (
    <div
      className={`${styles.invoiceCard} ${
        styles[darkMode ? "dark-mode" : "light-mode"]
      }`}
      onClick={() => router.push(`/invoice/${invoice.id}`)}
    >
      <div className={styles.upSection}>
        <span className={styles.id}>
          <span>#</span>
          {invoice.id}
        </span>
        <span className={styles.clientName}>{invoice.clientName}</span>
      </div>
      {/* =============================================== */}
      <div className={styles.downSection}>
        <div>
          <span className={styles.paymentDue}>
            Due{" "}
            {new Date(invoice.paymentDue).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>

          <div className={styles.total}>£{invoice.total.toFixed(2)}</div>
        </div>

        <span className={`${styles.status} ${styles[invoice.status]}`}>
          <StatusIcon status={invoice.status} />
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default InvoiceCardMobile;
