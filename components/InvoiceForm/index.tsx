"use client";

import { useState, useEffect, ReactNode } from "react";
import styles from "./InvoiceForm.module.scss";
import { useTheme } from "@/lib/context/ThemeContext";
import TrashIcon from "../icons/TrashIcon";
import { InvoiceFormData, InvoicePayload } from "@/types";
import { apiService } from "@/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Key for localStorage
const FORM_DATA_STORAGE_KEY = "invoiceFormData";

interface FormProps {
  onDiscard: () => void;
  formTitle?: string | ReactNode;
  formAction?: "CREATE" | "EDIT";
  initialData?: InvoicePayload;
}

const InvoiceForm = ({
  onDiscard,
  formTitle,
  formAction = "CREATE",
  initialData: i,
}: FormProps) => {
  const { darkMode } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Load persisted data from localStorage on initial render
  const getInitialFormData = (): InvoiceFormData => {
    if (formAction === "EDIT" && i) {
      return {
        billFromStreet: i.senderAddress?.street || "",
        billFromCity: i.senderAddress?.city || "",
        billFromPostCode: i.senderAddress?.postCode || "",
        billFromCountry: i.senderAddress?.country || "",
        billToClientName: i.clientName || "",
        billToClientEmail: i.clientEmail || "",
        billToStreet: i.clientAddress?.street || "",
        billToCity: i.clientAddress?.city || "",
        billToPostCode: i.clientAddress?.postCode || "",
        billToCountry: i.clientAddress?.country || "",
        invoiceDate: i.createdAt || new Date().toISOString().split("T")[0],
        paymentTerms: i.paymentTerms?.toString() || "Net 30 Days",
        projectDescription: i.description || "",
        items: i.items || [{ name: "", quantity: 1, price: 0, total: 0 }],
      };
    }

    // Load from localStorage for CREATE, or use default if none
    const savedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
    if (savedData && formAction === "CREATE") {
      return JSON.parse(savedData);
    }

    return {
      billFromStreet: "",
      billFromCity: "",
      billFromPostCode: "",
      billFromCountry: "",
      billToClientName: "",
      billToClientEmail: "",
      billToStreet: "",
      billToCity: "",
      billToPostCode: "",
      billToCountry: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      paymentTerms: "Net 30 Days",
      projectDescription: "",
      items: [{ name: "", quantity: 1, price: 0, total: 0 }],
    };
  };

  const [formData, setFormData] = useState<InvoiceFormData>(getInitialFormData);

  // Persist formData to localStorage when it changes (only for CREATE)
  useEffect(() => {
    if (formAction === "CREATE" && !i) {
      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, formAction, i]);

  const { mutateAsync: createInvoice, isPending: isCreating } = useMutation({
    mutationKey: ["createInvoice"],
    mutationFn: apiService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllInvoices"] });
      handleDiscard();
    },
  });

  const { mutateAsync: updateInvoice, isPending: isUpdating } = useMutation({
    mutationKey: ["updateInvoice"],
    mutationFn: apiService.updateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllInvoices", "getSingleInvoice"],
      });
      handleDiscard();
      router.refresh();
    },
  });

  const handleDiscard = () => {
    localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    onDiscard();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    const val =
      name === "quantity" || name === "price" ? parseFloat(value) || 0 : value;
    newItems[index] = { ...newItems[index], [name]: val };
    newItems[index].total = newItems[index].quantity * newItems[index].price;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0, total: 0 }],
    }));
  };

  const handleSubmit = (action: "draft" | "pending") => {
    if (!i?.id) return;
    const paymentTermsDays = parseInt(
      formData.paymentTerms.replace(/[^0-9]/g, ""),
      10
    );

    const invoiceDate = new Date(formData.invoiceDate);
    const paymentDueDate = new Date(invoiceDate);
    paymentDueDate.setDate(invoiceDate.getDate() + paymentTermsDays);
    const paymentDue = paymentDueDate.toISOString().split("T")[0];

    const total = formData.items.reduce((sum, item) => sum + item.total, 0);
    const payload = {
      senderAddress: {
        street: formData.billFromStreet,
        city: formData.billFromCity,
        postCode: formData.billFromPostCode,
        country: formData.billFromCountry,
      },
      clientAddress: {
        street: formData.billToStreet,
        city: formData.billToCity,
        postCode: formData.billToPostCode,
        country: formData.billToCountry,
      },
      clientName: formData.billToClientName,
      clientEmail: formData.billToClientEmail,
      paymentDue,
      paymentTerms: paymentTermsDays,
      description: formData.projectDescription,
      status: action,
      items: formData.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      total,
    };

    switch (formAction) {
      case "EDIT":
        if (!i || !i.id) {
          console.error(
            "Cannot update invoice: Initial data or invoice ID is missing"
          );
          return; // Prevent calling updateInvoice if I or I.id is undefined
        }
        updateInvoice({ invoice: payload, invoiceId: i.id });
        break;
      default:
        createInvoice(payload);
        break;
    }
  };

  const handleDeleteItem = (itemIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: formData.items.filter((_, i) => i !== itemIdx),
    }));
  };

  return (
    <div
      className={`${styles.newInvoiceForm} ${
        styles[darkMode ? "dark-mode" : "light-mode"]
      }`}
    >
      {isUpdating || (isCreating && <div className="modal"></div>)}
      <div className={styles.formContainer}>
        <button onClick={handleDiscard} className={styles.goBack}>
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
        <h2 className={styles.sectionTitle}>{formTitle || "Invoice Form"}</h2>

        <div className={styles.formSection}>
          <h3 className={styles.sectionHeader}>Bill From</h3>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Street Address</label>
            <input
              type="text"
              name="billFromStreet"
              value={formData.billFromStreet}
              onChange={handleInputChange}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.threeColumnGroup}`}>
            <div className={styles.twoOfThreeColumnGroup}>
              <div>
                <label className={styles.formLabel}>City</label>
                <input
                  type="text"
                  name="billFromCity"
                  value={formData.billFromCity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Post Code</label>
                <input
                  type="text"
                  name="billFromPostCode"
                  value={formData.billFromPostCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.oneOfThreeColumnGroup}>
              <label className={styles.formLabel}>Country</label>
              <input
                type="text"
                name="billFromCountry"
                value={formData.billFromCountry}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionHeader}>Bill To</h3>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{`Client's Name`}</label>
            <input
              type="text"
              name="billToClientName"
              value={formData.billToClientName}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{`Client's Email`}</label>
            <input
              type="email"
              name="billToClientEmail"
              value={formData.billToClientEmail}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Street Address</label>
            <input
              type="text"
              name="billToStreet"
              value={formData.billToStreet}
              onChange={handleInputChange}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.threeColumnGroup}`}>
            <div className={styles.twoOfThreeColumnGroup}>
              <div>
                <label className={styles.formLabel}>City</label>
                <input
                  type="text"
                  name="billToCity"
                  value={formData.billToCity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Post Code</label>
                <input
                  type="text"
                  name="billToPostCode"
                  value={formData.billToPostCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.oneOfThreeColumnGroup}>
              <label className={styles.formLabel}>Country</label>
              <input
                type="text"
                name="billToCountry"
                value={formData.billToCountry}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={`${styles.formGroup} ${styles.dateGroup}`}>
            <div>
              <label className={styles.formLabel}>Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                disabled={formAction === "EDIT"}
              />
            </div>
            <div>
              <label className={styles.formLabel}>Payment Terms</label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
              >
                <option value="Net 1 Day">Net 1 Day</option>
                <option value="Net 7 Days">Net 7 Days</option>
                <option value="Net 14 Days">Net 14 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Project Description</label>
            <input
              type="text"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={`${styles.formSection} ${styles.itemList}`}>
          <h3 className={styles.sectionHeader}>Item List</h3>
          {formData.items.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <div className={`${styles.formGroup} ${styles.itemName}`}>
                <label className={styles.formLabel}>Item Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </div>
              <div className={styles.itemDetails}>
                <div className={`${styles.formGroup} ${styles.qty}`}>
                  <label className={styles.formLabel}>Qty.</label>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    min="1"
                    required
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.price}`}>
                  <label className={styles.formLabel}>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.total}`}>
                  <label className={styles.formLabel}>Total</label>
                  <input type="number" value={item.total.toFixed(2)} readOnly />
                </div>
                <div className={`${styles.formGroup} ${styles.trash}`}>
                  <label
                    className={styles.formLabel}
                    style={{ visibility: "hidden" }}
                  >
                    {"Delete"}
                  </label>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className={styles.trashIcon}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className={styles.addItemButton} onClick={addItem}>
            + Add New Item
          </button>
        </div>

        <div className={styles.linearAndButtonGroupContainer}>
          <div className={styles.linear} />

          <div className={styles.buttonGroupContainer}>
            <div className={styles.buttonGroup}>
              {formAction === "EDIT" ? (
                <div></div>
              ) : (
                <button
                  className={`${styles.button} ${styles.discard}`}
                  onClick={handleDiscard}
                >
                  Discard
                </button>
              )}

              <div className={styles.saveButtons}>
                {formAction === "EDIT" ? (
                  <button
                    className={`${styles.button} ${styles.discard}`}
                    onClick={handleDiscard}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className={`${styles.button} ${styles.saveDraft}`}
                    onClick={() => handleSubmit("draft")}
                  >
                    Save as Draft
                  </button>
                )}
                {formAction === "EDIT" ? (
                  <button
                    className={`${styles.button} ${styles.saveSend}`}
                    onClick={() => handleSubmit("pending")}
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    className={`${styles.button} ${styles.saveSend}`}
                    onClick={() => handleSubmit("pending")}
                  >
                    Save & Send
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
