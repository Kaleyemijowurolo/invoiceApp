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
