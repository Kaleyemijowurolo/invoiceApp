"use client";

import { useState, useEffect, useReducer } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useTheme } from "@/lib/context/ThemeContext";
import styles from "./InvoiceForm.module.scss";

// Define InvoiceSchema without id and createdAt
const InvoiceSchema = z.object({
  paymentDue: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format, use YYYY-MM-DD",
  }),
  description: z.string().min(1, "Description is required"),
  paymentTerms: z.number().min(1, "Payment terms must be at least 1"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  status: z.enum(["draft", "pending", "paid"], {
    errorMap: () => ({ message: "Status must be draft, pending, or paid" }),
  }),
  senderAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postCode: z.string().min(1, "Post code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  clientAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postCode: z.string().min(1, "Post code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price cannot be negative"),
        total: z.number().min(0, "Total cannot be negative"),
      })
    )
    .min(1, "At least one item is required"),
  total: z.number().min(0, "Total cannot be negative"),
});

type InvoiceFormData = z.infer<typeof InvoiceSchema>;

type FormValue =
  | string
  | number
  | { street: string; city: string; postCode: string; country: string }
  | { name: string; quantity: number; price: number; total: number }[]
  | InvoiceFormData["status"];

type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof InvoiceFormData; value: FormValue }
  | { type: "ADD_ITEM" }
  | { type: "REMOVE_ITEM"; index: number }
  | {
      type: "UPDATE_ITEM";
      index: number;
      field: keyof InvoiceFormData["items"][number];
      value: string | number;
    };

const formReducer = (
  state: InvoiceFormData,
  action: FormAction
): InvoiceFormData => {
  switch (action.type) {
    case "UPDATE_FIELD": {
      const newState = { ...state, [action.field]: action.value };
      if (action.field === "items") {
        newState.total = (action.value as { total: number }[]).reduce(
          (sum: number, item: { total: number }) => sum + (item.total || 0),
          0
        );
      }
      return newState;
    }
    case "UPDATE_ITEM": {
      const items = [...state.items];
      items[action.index] = {
        ...items[action.index],
        [action.field]: action.value,
      };
      items[action.index].total =
        (items[action.index].quantity as number) *
        (items[action.index].price as number);
      const newState = { ...state, items };
      newState.total = items.reduce(
        (sum: number, item: { total: number }) => sum + (item.total || 0),
        0
      );
      return newState;
    }
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, { name: "", quantity: 1, price: 0, total: 0 }],
      };
    case "REMOVE_ITEM":
      const filteredItems = state.items.filter((_, i) => i !== action.index);
      const newState = { ...state, items: filteredItems };
      newState.total = filteredItems.reduce(
        (sum: number, item: { total: number }) => sum + (item.total || 0),
        0
      );
      return newState;
    default:
      return state;
  }
};

interface InvoiceFormProps {
  invoiceId?: string;
  initialData?: Omit<
    InvoiceFormData & { id: string; createdAt: string },
    "id" | "createdAt"
  >;
  onSuccess?: () => void;
}

//   interface InvoiceFormProps {
//     invoiceId?: string;
//     initialData?: InvoiceFormData;
//     onSuccess?: () => void;
//   }

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceId,
  initialData,
  onSuccess,
}) => {
  const { darkMode } = useTheme();
  const queryClient = useQueryClient();
  const [formData, dispatch] = useReducer(formReducer, {
    paymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    description: "",
    paymentTerms: 7,
    clientName: "",
    clientEmail: "",
    status: "pending",
    senderAddress: { street: "", city: "", postCode: "", country: "" },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    items: [{ name: "", quantity: 1, price: 0, total: 0 }],
    total: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "paymentDue",
        value: initialData.paymentDue,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "description",
        value: initialData.description,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "paymentTerms",
        value: initialData.paymentTerms,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "clientName",
        value: initialData.clientName,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "clientEmail",
        value: initialData.clientEmail,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "status",
        value: initialData.status,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "senderAddress",
        value: initialData.senderAddress,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "clientAddress",
        value: initialData.clientAddress,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "items",
        value: initialData.items,
      });
      dispatch({
        type: "UPDATE_FIELD",
        field: "total",
        value: initialData.total,
      });
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      const token = localStorage.getItem("token");
      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = invoiceId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save invoice");
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      if (initialData && invoiceId) {
        queryClient.setQueryData(["invoices", invoiceId], data);
      } else {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      }
      onSuccess?.();
    },
  });

  //   const validateForm = () => {
  //     const result = InvoiceFormSchema.safeParse(formData);
  //     if (!result.success) {
  //       const newErrors: Record<string, string> = {};
  //       result.error.errors.forEach((error) => {
  //         newErrors[error.path.join(".")] = error.message;
  //       });
  //       setErrors(newErrors);
  //       return false;
  //     }
  //     setErrors({});
  //     return true;
  //   };

  const validateForm = () => {
    const result = InvoiceSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        newErrors[error.path.join(".")] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  //   const handleChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     if (name.startsWith("items[")) {
  //       const match = name.match(/items\[(\d+)\]\.(name|quantity|price)/);
  //       if (match) {
  //         const index = parseInt(match[1], 10);
  //         const field = match[2];
  //         dispatch({
  //           type: "UPDATE_ITEM",
  //           index,
  //           field,
  //           value:
  //             field === "quantity" || field === "price"
  //               ? parseFloat(value) || 0
  //               : value,
  //         });
  //       }
  //     } else if (name === "paymentTerms") {
  //       dispatch({
  //         type: "UPDATE_FIELD",
  //         field: name,
  //         value: parseInt(value, 10) || 1,
  //       });
  //     } else {
  //       dispatch({
  //         type: "UPDATE_FIELD",
  //         field: name as keyof InvoiceFormData,
  //         value,
  //       });
  //     }
  //   };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("items[")) {
      const match = name.match(/items\[(\d+)\]\.(name|quantity|price)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2] as keyof InvoiceFormData["items"][number]; // Type assertion
        dispatch({
          type: "UPDATE_ITEM",
          index,
          field,
          value:
            field === "quantity" || field === "price"
              ? parseFloat(value) || 0
              : value,
        });
      }
    } else if (name === "paymentTerms") {
      dispatch({
        type: "UPDATE_FIELD",
        field: name,
        value: parseInt(value, 10) || 1,
      });
    } else {
      dispatch({
        type: "UPDATE_FIELD",
        field: name as keyof InvoiceFormData,
        value,
      });
    }
  };

  const addItem = () => dispatch({ type: "ADD_ITEM" });
  const removeItem = (index: number) =>
    dispatch({ type: "REMOVE_ITEM", index });

  const getColor = (key: string) => {
    const colors = {
      primaryPurple: "#7C5DFA",
      secondaryPurple: "#9277FF",
      mediumBlue: "#252945",
      red: "#EC5757",
    };
    return colors[key as keyof typeof colors] || "#000";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${darkMode ? styles.dark : ""}`}
    >
      <div className={styles.section}>
        <h2>Bill From</h2>
        <input
          name="senderAddress.street"
          value={formData.senderAddress.street}
          onChange={handleChange}
          placeholder="Street Address"
        />
        {errors["senderAddress.street"] && (
          <span className={styles.error}>{errors["senderAddress.street"]}</span>
        )}
        <input
          name="senderAddress.city"
          value={formData.senderAddress.city}
          onChange={handleChange}
          placeholder="City"
        />
        {errors["senderAddress.city"] && (
          <span className={styles.error}>{errors["senderAddress.city"]}</span>
        )}
        <input
          name="senderAddress.postCode"
          value={formData.senderAddress.postCode}
          onChange={handleChange}
          placeholder="Post Code"
        />
        {errors["senderAddress.postCode"] && (
          <span className={styles.error}>
            {errors["senderAddress.postCode"]}
          </span>
        )}
        <input
          name="senderAddress.country"
          value={formData.senderAddress.country}
          onChange={handleChange}
          placeholder="Country"
        />
        {errors["senderAddress.country"] && (
          <span className={styles.error}>
            {errors["senderAddress.country"]}
          </span>
        )}
      </div>

      <div className={styles.section}>
        <h2>Bill To</h2>
        <input
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          placeholder="Client Name"
        />
        {errors.clientName && (
          <span className={styles.error}>{errors.clientName}</span>
        )}
        <input
          name="clientEmail"
          value={formData.clientEmail}
          onChange={handleChange}
          placeholder="Client Email"
        />
        {errors.clientEmail && (
          <span className={styles.error}>{errors.clientEmail}</span>
        )}
        <input
          name="clientAddress.street"
          value={formData.clientAddress.street}
          onChange={handleChange}
          placeholder="Street Address"
        />
        {errors["clientAddress.street"] && (
          <span className={styles.error}>{errors["clientAddress.street"]}</span>
        )}
        <input
          name="clientAddress.city"
          value={formData.clientAddress.city}
          onChange={handleChange}
          placeholder="City"
        />
        {errors["clientAddress.city"] && (
          <span className={styles.error}>{errors["clientAddress.city"]}</span>
        )}
        <input
          name="clientAddress.postCode"
          value={formData.clientAddress.postCode}
          onChange={handleChange}
          placeholder="Post Code"
        />
        {errors["clientAddress.postCode"] && (
          <span className={styles.error}>
            {errors["clientAddress.postCode"]}
          </span>
        )}
        <input
          name="clientAddress.country"
          value={formData.clientAddress.country}
          onChange={handleChange}
          placeholder="Country"
        />
        {errors["clientAddress.country"] && (
          <span className={styles.error}>
            {errors["clientAddress.country"]}
          </span>
        )}
      </div>

      <div className={styles.section}>
        <h2>Item List</h2>
        {formData.items.map((item, index) => (
          <div key={index} className={styles.itemContainer}>
            <div className={styles.itemRow}>
              <input
                name={`items[${index}].name`}
                value={item.name}
                onChange={handleChange}
                placeholder="Item Name"
              />
              <input
                type="number"
                name={`items[${index}].quantity`}
                value={item.quantity}
                onChange={handleChange}
                placeholder="Quantity"
              />
              <input
                type="number"
                name={`items[${index}].price`}
                value={item.price}
                onChange={handleChange}
                placeholder="Price"
              />
              <input
                type="number"
                value={item.total}
                placeholder="Total"
                readOnly
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className={styles.removeButton}
                style={{ backgroundColor: getColor("red") }}
              >
                Remove
              </button>
            )}
            {errors[`items[${index}].name`] && (
              <span className={styles.error}>
                {errors[`items[${index}].name`]}
              </span>
            )}
            {errors[`items[${index}].quantity`] && (
              <span className={styles.error}>
                {errors[`items[${index}].quantity`]}
              </span>
            )}
            {errors[`items[${index}].price`] && (
              <span className={styles.error}>
                {errors[`items[${index}].price`]}
              </span>
            )}
            {errors[`items[${index}].total`] && (
              <span className={styles.error}>
                {errors[`items[${index}].total`]}
              </span>
            )}
          </div>
        ))}
        {errors.items && <span className={styles.error}>{errors.items}</span>}
        <button
          type="button"
          onClick={addItem}
          className={styles.addButton}
          style={{ backgroundColor: getColor("secondaryPurple") }}
        >
          + Add New Item
        </button>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          style={{ backgroundColor: getColor("mediumBlue") }}
          onClick={() => {
            /* Handle cancel logic */
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.saveButton}
          style={{ backgroundColor: getColor("primaryPurple") }}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Saving..."
            : invoiceId
            ? "Save Changes"
            : "Save & Send"}
        </button>
      </div>

      {mutation.error && (
        <span className={styles.error}>
          {(mutation.error as Error).message}
        </span>
      )}
    </form>
  );
};
