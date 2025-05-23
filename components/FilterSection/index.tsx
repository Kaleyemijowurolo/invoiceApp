"use client";

import { useState } from "react";
import styles from "./FilterSection.module.scss";
import { useTheme } from "@/lib/context/ThemeContext";
import InvoiceForm from "../InvoiceForm";
import { ArrowDownIcon, ArrowUpIcon } from "../icons/ArrowIcons";
import PlusIcon from "../icons/PlusIcon";

interface FilterSectionProps {
  invoiceCount: number;
  onFilterChange: (status: string[]) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  invoiceCount,
  onFilterChange,
}) => {
  const { darkMode } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatingNewInvoice, setIsCreatingNewInvoice] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

  const filters = ["Draft", "Pending", "Paid"];

  const handleCreateNewInvoiceModal = () => {
    setIsCreatingNewInvoice(!isCreatingNewInvoice);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };
  const handleCloseNewInvoiceModal = () => {
    setIsCreatingNewInvoice(false);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter((prevSelected) => {
      const newSelected = prevSelected.includes(filter.toLowerCase())
        ? prevSelected.filter((f) => f !== filter.toLowerCase())
        : [...prevSelected, filter.toLowerCase()];
      onFilterChange(newSelected); // Call with the new state
      return newSelected;
    });
  };

  return (
    <div
      className={`${styles.filterSection}
     ${styles[darkMode ? "dark-mode" : "light-mode"]}`}
    >
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
            className={`${styles.filterButton} 
             ${styles[darkMode ? "dark-mode" : "light-mode"]}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Filter <span className={styles.byStatusText}>by status</span>{" "}
            <span>{isDropdownOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdown}>
              {filters.map((filter) => (
                <label
                  key={filter}
                  htmlFor={filter.toLowerCase()}
                  className={
                    selectedFilter.includes(filter.toLowerCase())
                      ? styles.active
                      : ""
                  }
                >
                  <input
                    type="checkbox"
                    id={filter.toLowerCase()}
                    checked={selectedFilter.includes(filter.toLowerCase())}
                    onChange={() => handleFilterSelect(filter)}
                  />

                  {filter}
                </label>
              ))}
            </ul>
          )}
        </div>

        <button
          className={styles.newInvoiceButton}
          onClick={handleCreateNewInvoiceModal}
        >
          <PlusIcon />
          <div className={styles.newInvoiceText}>
            <span>New Invoice</span>
          </div>
        </button>
        <button
          onClick={handleCreateNewInvoiceModal}
          className={styles.newInvoiceButtonMobile}
        >
          <svg
            width="90"
            height="44"
            viewBox="0 0 90 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_0_1494)">
              <rect width="90" height="44" rx="22" fill="#7C5DFA" />
              <path
                d="M48.7 19.155L48.865 19.185V27H46.6225V17.1H49.6825L53.695 24.9L53.53 24.93V17.1H55.7725V27H52.6975L48.7 19.155ZM59.0348 24.405C59.0498 24.625 59.1198 24.82 59.2448 24.99C59.3698 25.16 59.5423 25.295 59.7623 25.395C59.9873 25.49 60.2523 25.5375 60.5573 25.5375C60.8473 25.5375 61.1073 25.5075 61.3373 25.4475C61.5723 25.3875 61.7748 25.3125 61.9448 25.2225C62.1198 25.1325 62.2548 25.04 62.3498 24.945L63.2348 26.355C63.1098 26.49 62.9323 26.6225 62.7023 26.7525C62.4773 26.8775 62.1798 26.98 61.8098 27.06C61.4398 27.14 60.9723 27.18 60.4073 27.18C59.7273 27.18 59.1223 27.0525 58.5923 26.7975C58.0623 26.5425 57.6448 26.1675 57.3398 25.6725C57.0348 25.1775 56.8823 24.5725 56.8823 23.8575C56.8823 23.2575 57.0123 22.7175 57.2723 22.2375C57.5373 21.7525 57.9198 21.37 58.4198 21.09C58.9198 20.805 59.5223 20.6625 60.2273 20.6625C60.8973 20.6625 61.4773 20.785 61.9673 21.03C62.4623 21.275 62.8423 21.64 63.1073 22.125C63.3773 22.605 63.5123 23.205 63.5123 23.925C63.5123 23.965 63.5098 24.045 63.5048 24.165C63.5048 24.285 63.4998 24.365 63.4898 24.405H59.0348ZM61.3673 23.2125C61.3623 23.0525 61.3198 22.895 61.2398 22.74C61.1598 22.58 61.0398 22.45 60.8798 22.35C60.7198 22.245 60.5148 22.1925 60.2648 22.1925C60.0148 22.1925 59.8023 22.2425 59.6273 22.3425C59.4573 22.4375 59.3273 22.5625 59.2373 22.7175C59.1473 22.8725 59.0973 23.0375 59.0873 23.2125H61.3673ZM69.1805 23.43L67.748 27H65.6555L63.6155 20.8425H66.038L67.0205 24.5625L68.438 20.9625H69.938L71.333 24.5625L72.323 20.8425H74.7455L72.713 27H70.628L69.1805 23.43Z"
                fill="white"
              />
              <circle cx="22" cy="22" r="16" fill="white" />
              <path
                d="M23.3131 27.0234V23.3136H27.0229V20.7333H23.3131V17.0234H20.7328V20.7333H17.0229V23.3136H20.7328V27.0234H23.3131Z"
                fill="#7C5DFA"
              />
            </g>
            <defs>
              <clipPath id="clip0_0_1494">
                <rect width="90" height="44" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {isCreatingNewInvoice && (
        <div className={"modal"}>
          <InvoiceForm
            formAction="CREATE"
            formTitle="New Invoice"
            onDiscard={handleCloseNewInvoiceModal}
          />
        </div>
      )}
    </div>
  );
};

export default FilterSection;
