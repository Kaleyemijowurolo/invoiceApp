"use client";

import { useState, useEffect } from "react";
import styles from "./NewInvoiceForm.module.scss";
import { useTheme } from "@/lib/context/ThemeContext";
import TrashIcon from "../icons/TrashIcon";
import { InvoiceFormData } from "@/types";

interface FormProps {
  onDiscard: () => void;
  formTitle?: string;
  formAction?: "CREATE" | "EDIT";
}

const NewInvoiceForm = ({ onDiscard, formTitle, formAction }: FormProps) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<InvoiceFormData>({
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
  });

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

  const handleSubmit = (action: string) => {
    console.log("Form Data:", formData);
    console.log(`Action: ${action}`);
    console.log(`Form Action: ${formAction}`);
    // Add save logic here (e.g., API call)
  };

  const handleDeleteItem = (itemIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: formData?.items?.filter((_, i) => i !== itemIdx),
    }));
  };

  return (
    <div
      className={`${styles.newInvoiceForm} ${
        styles[darkMode ? "dark-mode" : "light-mode"]
      }`}
    >
      <div className={styles.formContainer}>
        <button onClick={onDiscard} className={styles.goBack}>
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
            <label className={styles.formLabel}>Client's Name</label>
            <input
              type="text"
              name="billToClientName"
              value={formData.billToClientName}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Client's Email</label>
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
        {/* Item list */}

        <div className={`${styles.formSection} ${styles.itemList}`}>
          <h3 className={styles.sectionHeader}>Item List</h3>
          {formData.items.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <div className={`${styles.formGroup} ${styles.itemName}`}>
                <label className={styles.formLabel}>Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </div>
              <div className={styles.itemDetails}>
                <div className={`${styles.formGroup}  ${styles.qty} `}>
                  <label className={styles.formLabel}>Qty.</label>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    min="1"
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
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.total}`}>
                  <label className={styles.formLabel}>Total</label>
                  <input type="number" value={item.total.toFixed(2)} readOnly />
                </div>
                <div className={`${styles.formGroup} ${styles.trash}`}>
                  <label
                    className={styles.formLabel}
                    style={{
                      visibility: "hidden",
                    }}
                  >
                    {" "}
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
              <button
                className={`${styles.button} ${styles.discard}`}
                onClick={onDiscard}
              >
                Discard
              </button>
              <div className={styles.saveButtons}>
                <button
                  className={`${styles.button} ${styles.saveDraft}`}
                  onClick={() => handleSubmit("saveDraft")}
                >
                  Save as Draft
                </button>
                <button
                  className={`${styles.button} ${styles.saveSend}`}
                  onClick={() => handleSubmit("saveSend")}
                >
                  Save & Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceForm;
