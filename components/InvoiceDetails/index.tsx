"use client";

import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./InvoiceDetails.module.scss";
import { useRouter } from "next/navigation";

const InvoiceDetails = ({ id }: { id: string }) => {
  const { darkMode } = useTheme();
  const router = useRouter();

  const invoice = {
    id: "XM9141",
    description: "Graphic Design",
    status: "pending",
    invoiceDate: "21 Aug 2021",
    paymentDue: "20 Sep 2021",
    billFrom: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    billTo: {
      name: "Alex Grim",
      email: "alexgrim@mail.com",
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      { name: "Banner Design", quantity: 1, price: 156.0, total: 156.0 },
      { name: "Email Design", quantity: 2, price: 200.0, total: 400.0 },
    ],
    amountDue: 556.0,
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleEdit = () => {
    console.log("Edit invoice");
    // Add edit logic here
  };

  const handleDelete = () => {
    console.log("Delete invoice");
    // Add delete logic here
  };

  const handleMarkAsPaid = () => {
    console.log("Mark as paid");
    // Add mark as paid logic here
  };

  return (
    <div
      className={`${styles.invoiceDetails} ${
        styles[darkMode ? "dark-mode" : "light-mode"]
      }`}
    >
      <a className={styles.goBack} onClick={handleGoBack}>
        Go back - {id}
      </a>

      <div className={styles.header}>
        <div>
          <div className={styles.invoiceId}>#{invoice.id}</div>
          <div className={styles.description}>{invoice.description}</div>
        </div>
      </div>

      <div className={styles.statusSection}>
        <div className={`${styles.status} ${styles[invoice.status]}`}>
          <span>●</span> {invoice.status}
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.edit}`}
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className={`${styles.button} ${styles.delete}`}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className={`${styles.button} ${styles.markPaid}`}
            onClick={handleMarkAsPaid}
          >
            Mark as Paid
          </button>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div>
          <div className={styles.label}>Invoice Date</div>
          <div className={styles.value}>{invoice.invoiceDate}</div>
          <div className={styles.label}>Payment Due</div>
          <div className={styles.value}>{invoice.paymentDue}</div>
        </div>
        <div>
          <div className={styles.label}>Bill To</div>
          <div className={styles.value}>{invoice.billTo.name}</div>
          <div className={styles.value}>{invoice.billTo.email}</div>
          <div className={styles.value}>{invoice.billTo.street}</div>
          <div className={styles.value}>
            {invoice.billTo.city}, {invoice.billTo.postCode}
          </div>
          <div className={styles.value}>{invoice.billTo.country}</div>
        </div>
      </div>

      <div className={styles.itemList}>
        <div className={styles.itemRow}>
          <div className={styles.label}>Item Name</div>
          <div className={styles.label}>QTY.</div>
          <div className={styles.label}>Price</div>
          <div className={styles.label}>Total</div>
        </div>
        {invoice.items.map((item, index) => (
          <div key={index} className={styles.itemRow}>
            <div className={styles.value}>{item.name}</div>
            <div className={styles.value}>{item.quantity}</div>
            <div className={styles.value}>£{item.price.toFixed(2)}</div>
            <div className={styles.value}>£{item.total.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className={styles.amountDue}>
        <span>Amount Due</span>
        <span>£{invoice.amountDue.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default InvoiceDetails;
