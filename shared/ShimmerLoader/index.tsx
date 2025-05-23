"use client";
import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./ShimmerLoader.module.scss";

const ShimmerLoader: React.FC = () => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`${styles.shimmerWrapper} ${
        styles[darkMode ? "dark-mode" : "light-mode"]
      }`}
    >
      {/* Mimic FilterSection */}
      <div className={styles.filterSection}>
        <div className={styles.header}>
          <div className={styles.titleShimmer}></div>
          <div className={styles.countShimmer}></div>
        </div>
        <div className={styles.filterButtonShimmer}></div>
        <div className={styles.newInvoiceButtonShimmer}></div>
      </div>

      {/* Mimic InvoiceList */}
      <div className={styles.invoiceList}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className={styles.invoiceItemShimmer}>
            <div className={styles.idShimmer}></div>
            <div className={styles.clientNameShimmer}></div>
            <div className={styles.totalShimmer}></div>
            <div className={styles.statusShimmer}></div>
            <div className={styles.paymentDueShimmer}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShimmerLoader;
