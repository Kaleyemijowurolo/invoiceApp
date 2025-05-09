"use client";

import { useState } from "react";
import styles from "./FilterSection.module.scss";

interface FilterSectionProps {
  invoiceCount: number;
  onFilterChange: (status: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  invoiceCount,
  onFilterChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Draft", "Pending", "Paid"];

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
    onFilterChange(filter === "All" ? "" : filter.toLowerCase());
  };

  return (
    <div className={styles.filterSection}>
      <div className={styles.header}>
        <h1>Invoices</h1>
        <p>
          {invoiceCount ? invoiceCount : "No"}{" "}
          {invoiceCount === 1 ? "invoice" : "invoices"}
        </p>
      </div>
      <div className={styles.actions}>
        <div className={styles.filter}>
          <button
            className={styles.filterButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Filter by status{" "}
            <span>{isDropdownOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdown}>
              {filters.map((filter) => (
                <li
                  key={filter}
                  className={filter === selectedFilter ? styles.active : ""}
                  onClick={() => handleFilterSelect(filter)}
                >
                  {filter}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className={styles.newInvoiceButton}
          // onClick={() => (window.location.href = "/invoice/new")}
        >
          <PlusIcon />
          <div className={styles.newInvoiceText}>New Invoice</div>
          {/* New Invoice */}
        </button>
      </div>
    </div>
  );
};

export default FilterSection;

const ArrowDownIcon = () => (
  <svg
    width="10"
    height="7"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1L5.2279 5.2279L9.4558 1" stroke="#7C5DFA" stroke-width="2" />
  </svg>
);
const ArrowUpIcon = () => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.47388 6.19128L5.20955 2.00012L1.01839 6.26445"
      stroke="#7C5DFA"
      stroke-width="2"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="16" fill="white" />
    <path
      d="M17.3131 21.0229V17.3131H21.0229V14.7328H17.3131V11.0229H14.7328V14.7328H11.0229V17.3131H14.7328V21.0229H17.3131Z"
      fill="#7C5DFA"
    />
  </svg>
);
