import { z } from "zod";

// Validation schema using Zod
export const CreateInvoiceSchema = z.object({
  id: z.string().optional(), // ID is optional in the request
  paymentDue: z.string().transform((str) => new Date(str)),
  description: z.string().min(1),
  paymentTerms: z.number().min(1),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  status: z.enum(["draft", "pending", "paid"]),
  senderAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postCode: z.string().min(1),
    country: z.string().min(1),
  }),
  clientAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postCode: z.string().min(1),
    country: z.string().min(1),
  }),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().min(1),
        price: z.number().min(0),
        total: z.number().min(0),
      })
    )
    .min(1),
  total: z.number().min(0),
});

export const UpdateInvoiceSchema = z.object({
  paymentDue: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  description: z.string().min(1).optional(),
  paymentTerms: z.number().min(1).optional(),
  clientName: z.string().min(1).optional(),
  clientEmail: z.string().email().optional(),
  status: z.enum(["draft", "pending", "paid"]).optional(),
  senderAddress: z
    .object({
      street: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
      postCode: z.string().min(1).optional(),
      country: z.string().min(1).optional(),
    })
    .optional(),
  clientAddress: z
    .object({
      street: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
      postCode: z.string().min(1).optional(),
      country: z.string().min(1).optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1).optional(),
        quantity: z.number().min(1).optional(),
        price: z.number().min(0).optional(),
        total: z.number().min(0).optional(),
      })
    )
    .min(1)
    .optional(),
  total: z.number().min(0).optional(),
});

// Validation schema for query parameters
export const InvoiceQuerySchema = z.object({
  status: z
    .string()
    .nullable() // Allow null from searchParams.get
    .optional()
    .transform((val) => (val ? val.split(",").filter((s) => s) : undefined))
    .refine(
      (val) =>
        !val || val.every((s) => ["draft", "pending", "paid"].includes(s)),
      { message: "Invalid status value" }
    ),
  page: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)) // Default to 1
    .refine((val) => val > 0, { message: "Page must be greater than 0" }),
  limit: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)) // Default to 10
    .refine((val) => val > 0, { message: "Limit must be greater than 0" }),
});

export const StatusSchema = z.object({
  status: z.enum(["draft", "pending", "paid"]),
});

export const InvoiceFormSchema = z.object({
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

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});
