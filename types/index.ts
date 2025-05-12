export type UserSessionProps = {
  email: string;
  name: string;
};

export interface Item {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Invoice {
  _id?: string;
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: "draft" | "pending" | "paid";
  total: number;
  items: Item[];
  senderAddress: Address;
  clientAddress: Address;
}

export interface PaginatedInvoicesResponse {
  invoices: Invoice[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface InvoiceFormItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceFormData {
  billFromStreet: string;
  billFromCity: string;
  billFromPostCode: string;
  billFromCountry: string;
  billToClientName: string;
  billToClientEmail: string;
  billToStreet: string;
  billToCity: string;
  billToPostCode: string;
  billToCountry: string;
  invoiceDate: string;
  paymentTerms: string;
  // paymentTerms: string;
  projectDescription: string;
  items: InvoiceFormItem[];
}

export interface InvoicePayload {
  id?: string;
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  clientName: string;
  clientEmail: string;
  createdAt?: string;
  paymentDue: string;
  paymentTerms: number;
  description: string;
  status: "draft" | "pending" | "paid";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
}
