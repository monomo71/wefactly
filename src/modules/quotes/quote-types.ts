import type { Quote } from '@/types/domain';

export interface QuoteLineFormValues {
  sourceProductId: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

export interface QuoteFormValues {
  customerId: string;
  quoteDate: string;
  validUntil: string;
  notes: string;
  currency: string;
  lines: QuoteLineFormValues[];
}

export type QuoteValidationErrors = {
  customerId?: string;
  quoteDate?: string;
  validUntil?: string;
  currency?: string;
  lines?: Array<{
    description?: string;
    quantity?: string;
    unitPrice?: string;
  }>;
};

export interface QuoteRecord extends Quote {}

export const emptyQuoteLineFormValues: QuoteLineFormValues = {
  sourceProductId: '',
  description: '',
  quantity: '1',
  unitPrice: '0.00',
};

export const emptyQuoteFormValues: QuoteFormValues = {
  customerId: '',
  quoteDate: new Date().toISOString().slice(0, 10),
  validUntil: '',
  notes: '',
  currency: 'EUR',
  lines: [{ ...emptyQuoteLineFormValues }],
};
