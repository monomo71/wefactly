export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization extends BaseRecord {
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  registrationNumber?: string | null;
  taxNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country: string;
}

export interface User extends BaseRecord {
  organizationId: string;
  email: string;
  fullName: string;
  isActive: boolean;
  lastLoginAt?: string | null;
}

export interface Customer extends BaseRecord {
  organizationId: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  registrationNumber?: string | null;
  taxNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  country: string;
}

export interface Product extends BaseRecord {
  organizationId: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  unitLabel: string;
  unitPrice: number;
  currency: string;
}

export interface QuoteLine extends BaseRecord {
  quoteId: string;
  sourceProductId?: string | null;
  description: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  sortOrder: number;
}

export interface Quote extends BaseRecord {
  organizationId: string;
  customerId: string;
  status: 'draft' | 'sent';
  quoteDate: string;
  validUntil?: string | null;
  notes?: string | null;
  currency: string;
  subtotalCents: number;
  totalCents: number;
  sentAt?: string | null;
  lines: QuoteLine[];
}

export interface InvoiceLine extends BaseRecord {
  invoiceId: string;
  sourceProductId?: string | null;
  description: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  sortOrder: number;
}

export interface Invoice extends BaseRecord {
  organizationId: string;
  customerId: string;
  correctionOfInvoiceId?: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  invoiceNumber?: string | null;
  issueDate: string;
  dueDate?: string | null;
  notes?: string | null;
  currency: string;
  subtotalCents: number;
  totalCents: number;
  finalizedAt?: string | null;
  sentAt?: string | null;
  paidAt?: string | null;
  lines: InvoiceLine[];
}
