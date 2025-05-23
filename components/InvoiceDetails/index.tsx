"use client";

import { Invoice } from "@/types";
import { useRouter } from "next/navigation";
import styles from "./InvoiceDetails.module.scss";
import { useTheme } from "@/lib/context/ThemeContext";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/apiServices";
import ConfirmModal from "@/shared/ConfirmModal";
import InvoiceForm from "../InvoiceForm";

const InvoiceDetails = ({ invoice: i }: { invoice: Invoice }) => {
  const { darkMode } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteInvoice, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteInvoice"],
    mutationFn: () => apiService.deleteInvoice(i?.id),
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getAllInvoices"] });
      router.replace("/dashboard");
    },
  });

  const { mutateAsync: updateInvoiceStatus, isPending: isUpdating } =
    useMutation({
      mutationKey: ["updateInvoiceStatus"],
      mutationFn: () =>
        apiService.updateInvoiceStatus({ invoiceId: i?.id, status: "paid" }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["getAllInvoices", "getSingleInvoice"],
        });
        router.refresh();
        setIsUpdateModalOpen(false);
      },
    });

  // const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isEditingInvoiceModalOpen, setIsEditingInvoiceModalOpen] =
    useState(false);

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  const handleEdit = () => {
    setIsEditingInvoiceModalOpen(!isEditingInvoiceModalOpen);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true); // Open the modal
  };

  const handleMarkAsPaid = () => {
    setIsUpdateModalOpen(true);
  };

  // Format the paymentDue date
  const formattedDate = new Date(i?.paymentDue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  //   / Calculate the sum of all totals in invoice.items
  const itemsTotal =
    i?.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;

  return (
    <div className={styles.invoiceDetailContainer}>
      {(isDeleting || isUpdating) && <div className={styles.overlay}></div>}
      <div
        className={`${styles.invoiceDetails} ${
          styles[darkMode ? "dark-mode" : "light-mode"]
        }`}
      >
        <button onClick={handleGoBack} className={styles.goBack}>
          <svg
            width="7"
            height="11"
            viewBox="0 0 7 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.22778 0.885742L1.99988 5.11364L6.22778 9.34155"
              stroke="#7C5DFA"
              stroke-width="2"
            />
          </svg>
          <p>Go back</p>
        </button>

        <div className={styles.statusSection}>
          <div className={styles.statusContainer}>
            <p>Status</p>
            <div className={`${styles.status} ${styles[i?.status]}`}>
              <span>●</span> {i?.status}
            </div>
          </div>

          <div className={`${styles.buttonGroup} ${styles.buttonGroupDesktop}`}>
            <button
              className={`${styles.button} ${styles.edit}`}
              onClick={handleEdit}
              disabled={i?.status === "paid"}
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
              disabled={i?.status === "paid"}
            >
              Mark as Paid
            </button>
          </div>

          {/* mobile */}
          <div
            className={`${styles.buttonGroup} ${styles.buttonGroupResponsive}`}
          >
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

        <div className={styles.detailsSection}>
          <div className={styles.header}>
            <div>
              <div className={styles.invoiceId}>#{i?.id}</div>
              <div className={styles.description}>{i?.description}</div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div>
              <div>
                <div className={styles.label}>Invoice Date</div>
                <div className={styles.value}>{formattedDate}</div>
              </div>
              <div>
                <div className={styles.label}>Payment Due</div>
                <div className={styles.value}>{formattedDate}</div>
              </div>
            </div>
            <div>
              <div>
                <div className={styles.label}>Bill To</div>
                <div className={styles.value}>{i?.clientName}</div>
              </div>
              <div>
                <div className={`${styles.address} ${styles.label}`}>
                  <span> {i?.clientAddress?.street}</span>
                  <span>{i?.clientAddress?.city}, </span>
                  <span>{i?.clientAddress?.postCode} </span>
                  <span>{i?.clientAddress?.country}</span>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className={styles.label}>Sent to</div>
                <div className={styles.value}>{i?.clientEmail}</div>
              </div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <div className={styles.itemList}>
              <div className={styles.itemRow}>
                <div className={styles.label}>Item Name</div>
                <div className={styles.label}>QTY.</div>
                <div className={styles.label}>Price</div>
                <div className={styles.label}>Total</div>
              </div>
              {i?.items?.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.value}>{item?.name}</div>
                  <div className={styles.value}>{item?.quantity}</div>
                  <div className={styles.value}>£{item?.price.toFixed(2)}</div>
                  <div className={styles.value}>£{item?.total.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className={styles.amountDue}>
              <span>Amount Due</span>

              <span>£{itemsTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteInvoice()}
        title="Confirm Deletion"
        description={`Are you sure you want to delete invoice #${i?.id}? This action cannot be undone.`}
      />
      <ConfirmModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onConfirm={() => updateInvoiceStatus()}
        type="update"
        title="Confirm Update"
        confirmLabel="Mark as Paid"
        description={`Are you sure you want to mark invoice #${i?.id} as paid?`}
      />
      {isEditingInvoiceModalOpen && (
        <div className={"modal"}>
          <InvoiceForm
            formAction="EDIT"
            formTitle={
              <span className={styles.editModalId}>
                Edit <span>#</span>
                {i?.id}
              </span>
            }
            onDiscard={handleEdit}
            initialData={i}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
