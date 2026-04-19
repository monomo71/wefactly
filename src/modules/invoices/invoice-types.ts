import type { Invoice } from '@/types/domain';

export interface InvoiceLineFormValues {
  sourceProductId: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

export interface InvoiceFormValues {
  customerId: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  currency: string;
  lines: InvoiceLineFormValues[];
}

export type InvoiceValidationErrors = {
  customerId?: string;
  issueDate?: string;
  dueDate?: string;
  currency?: string;
  lines?: Array<{
    description?: string;
    quantity?: string;
    unitPrice?: string;
  }>;
};

export interface InvoiceRecord extends Invoice {}

export const emptyInvoiceLineFormValues: InvoiceLineFormValues = {
  sourceProductId: '',
  description: '',
  quantity: '1',
  unitPrice: '0.00',
};

export const emptyInvoiceFormValues: InvoiceFormValues = {
  customerId: '',
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  notes: '',
  currency: 'EUR',
  lines: [{ ...emptyInvoiceLineFormValues }],
};
