import { listCustomers } from '@/modules/customers/customer-service';
import { listProducts } from '@/modules/products/product-service';
import type { Quote, QuoteLine } from '@/types/domain';
import type { QuoteFormValues } from '@/modules/quotes/quote-types';

const QUOTES_STORAGE_KEY = 'wefactly.quotes';
const DEFAULT_ORGANIZATION_ID = 'single-tenant-organization';

export function listQuotes(): Quote[] {
  return readQuotes().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getQuoteById(quoteId: string): Quote | null {
  return readQuotes().find((quote) => quote.id === quoteId) ?? null;
}

export function createQuote(values: QuoteFormValues): Quote {
  const now = new Date().toISOString();
  const quoteId = createQuoteId();
  const lines = createLines(quoteId, values);
  const subtotalCents = lines.reduce((total, line) => total + line.lineTotalCents, 0);

  const nextQuote: Quote = {
    id: quoteId,
    organizationId: DEFAULT_ORGANIZATION_ID,
    customerId: values.customerId,
    status: 'draft',
    quoteDate: values.quoteDate,
    validUntil: values.validUntil || null,
    notes: values.notes.trim() || null,
    currency: values.currency.trim().toUpperCase() || 'EUR',
    subtotalCents,
    totalCents: subtotalCents,
    sentAt: null,
    createdAt: now,
    updatedAt: now,
    lines,
  };

  const quotes = readQuotes();
  quotes.push(nextQuote);
  writeQuotes(quotes);

  return nextQuote;
}

export function updateQuote(quoteId: string, values: QuoteFormValues): Quote {
  const quotes = readQuotes();
  const quoteIndex = quotes.findIndex((quote) => quote.id === quoteId);

  if (quoteIndex === -1) {
    throw new Error('Offerte niet gevonden.');
  }

  const existingQuote = quotes[quoteIndex];
  if (existingQuote.status !== 'draft') {
    throw new Error('Alleen conceptoffertes mogen worden bewerkt.');
  }

  const lines = createLines(existingQuote.id, values);
  const subtotalCents = lines.reduce((total, line) => total + line.lineTotalCents, 0);

  const updatedQuote: Quote = {
    ...existingQuote,
    customerId: values.customerId,
    quoteDate: values.quoteDate,
    validUntil: values.validUntil || null,
    notes: values.notes.trim() || null,
    currency: values.currency.trim().toUpperCase() || 'EUR',
    subtotalCents,
    totalCents: subtotalCents,
    updatedAt: new Date().toISOString(),
    lines,
  };

  quotes[quoteIndex] = updatedQuote;
  writeQuotes(quotes);

  return updatedQuote;
}

export function markQuoteAsSent(quoteId: string): Quote {
  const quotes = readQuotes();
  const quoteIndex = quotes.findIndex((quote) => quote.id === quoteId);

  if (quoteIndex === -1) {
    throw new Error('Offerte niet gevonden.');
  }

  const existingQuote = quotes[quoteIndex];
  if (existingQuote.status === 'sent') {
    return existingQuote;
  }

  const sentQuote: Quote = {
    ...existingQuote,
    status: 'sent',
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  quotes[quoteIndex] = sentQuote;
  writeQuotes(quotes);

  return sentQuote;
}

export function mapQuoteToFormValues(quote: Quote): QuoteFormValues {
  return {
    customerId: quote.customerId,
    quoteDate: quote.quoteDate,
    validUntil: quote.validUntil ?? '',
    notes: quote.notes ?? '',
    currency: quote.currency,
    lines: quote.lines.map((line) => ({
      sourceProductId: line.sourceProductId ?? '',
      description: line.description,
      quantity: line.quantity.toFixed(2).replace(/\.00$/, ''),
      unitPrice: centsToDecimalString(line.unitPriceCents),
    })),
  };
}

export function findCustomerName(customerId: string): string {
  const customer = listCustomers().find((entry) => entry.id === customerId);
  return customer?.name ?? 'Onbekende klant';
}

export function getQuoteCustomers() {
  return listCustomers();
}

export function getQuoteProducts() {
  return listProducts();
}

function createLines(quoteId: string, values: QuoteFormValues): QuoteLine[] {
  return values.lines.map((line, index) => {
    const quantity = normalizeQuantity(line.quantity);
    const unitPriceCents = toCents(line.unitPrice);

    return {
      id: createLineId(index),
      quoteId,
      sourceProductId: line.sourceProductId || null,
      description: line.description.trim(),
      quantity,
      unitPriceCents,
      lineTotalCents: Math.round(quantity * unitPriceCents),
      sortOrder: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

function normalizeQuantity(value: string): number {
  const parsedValue = Number(value.replace(',', '.'));
  return Number.isFinite(parsedValue) ? parsedValue : 1;
}

function toCents(value: string): number {
  const parsedValue = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.round(parsedValue * 100);
}

function centsToDecimalString(value: number): string {
  return (value / 100).toFixed(2);
}

function readQuotes(): Quote[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(QUOTES_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Quote[];
  } catch {
    return [];
  }
}

function writeQuotes(quotes: Quote[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
  }
}

function createQuoteId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `quote-${Date.now()}`;
}

function createLineId(index: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `quote-line-${Date.now()}-${index}`;
}
