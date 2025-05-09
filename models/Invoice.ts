import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false } // Disable _id
);

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false } // Disable _id
);

const InvoiceSchema = new Schema(
  {
    id: { type: String, required: true, uniques: true }, // Custom ID like "RT3080"
    paymentDue: { type: Date, required: true },
    description: { type: String, required: true },
    paymentTerms: { type: Number, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "paid"],
      required: true,
    },
    senderAddress: { type: AddressSchema, required: true },
    clientAddress: { type: AddressSchema, required: true },
    items: [{ type: ItemSchema, required: true }],
    total: { type: Number, required: true },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  } // Disable _id
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
