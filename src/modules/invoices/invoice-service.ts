import { listCustomers } from '@/modules/customers/customer-service';
import { calculateInvoiceDraftTotals, centsToDecimalString, formatMoneyFromCents } from '@/modules/invoices/invoice-calculations';
import type { InvoiceFormValues } from '@/modules/invoices/invoice-types';
import { listProducts } from '@/modules/products/product-service';
import type { Invoice, InvoiceLine } from '@/types/domain';

const INVOICES_STORAGE_KEY = 'wefactly.invoices';
const SETTINGS_STORAGE_KEY = 'wefactly.runtime.settings';
const DEFAULT_ORGANIZATION_ID = 'single-tenant-organization';

interface RuntimeSettings {
  invoiceNumberPrefix: string;
  invoiceNumberNextValue: number;
}

export function listInvoices(): Invoice[] {
  return readInvoices().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function getInvoiceById(invoiceId: string): Invoice | null {
  return readInvoices().find((invoice) => invoice.id === invoiceId) ?? null;
}

export function createInvoice(values: InvoiceFormValues): Invoice {
  const now = new Date().toISOString();
  const invoiceId = createInvoiceId();
  const totals = calculateInvoiceDraftTotals(values);

  const nextInvoice: Invoice = {
    id: invoiceId,
    organizationId: DEFAULT_ORGANIZATION_ID,
    customerId: values.customerId,
    correctionOfInvoiceId: null,
    status: 'draft',
    invoiceNumber: null,
    issueDate: values.issueDate,
    dueDate: values.dueDate || null,
    notes: values.notes.trim() || null,
    currency: values.currency.trim().toUpperCase() || 'EUR',
    subtotalCents: totals.subtotalCents,
    totalCents: totals.totalCents,
    finalizedAt: null,
    sentAt: null,
    paidAt: null,
    createdAt: now,
    updatedAt: now,
    lines: createLines(invoiceId, values),
  };

  const invoices = readInvoices();
  invoices.push(nextInvoice);
  writeInvoices(invoices);

  return nextInvoice;
}

export function updateInvoice(invoiceId: string, values: InvoiceFormValues): Invoice {
  const invoices = readInvoices();
  const invoiceIndex = invoices.findIndex((invoice) => invoice.id === invoiceId);

  if (invoiceIndex === -1) {
    throw new Error('Factuur niet gevonden.');
  }

  const existingInvoice = invoices[invoiceIndex];
  if (existingInvoice.status !== 'draft') {
    throw new Error('Alleen conceptfacturen mogen worden bewerkt.');
  }

  const totals = calculateInvoiceDraftTotals(values);

  const updatedInvoice: Invoice = {
    ...existingInvoice,
    customerId: values.customerId,
    issueDate: values.issueDate,
    dueDate: values.dueDate || null,
    notes: values.notes.trim() || null,
    currency: values.currency.trim().toUpperCase() || 'EUR',
    subtotalCents: totals.subtotalCents,
    totalCents: totals.totalCents,
    updatedAt: new Date().toISOString(),
    lines: createLines(existingInvoice.id, values),
  };

  invoices[invoiceIndex] = updatedInvoice;
  writeInvoices(invoices);

  return updatedInvoice;
}

export function deleteDraftInvoice(invoiceId: string): void {
  const invoices = readInvoices();
  const invoice = invoices.find((entry) => entry.id === invoiceId);

  if (!invoice) {
    throw new Error('Factuur niet gevonden.');
  }

  if (invoice.status !== 'draft') {
    throw new Error('Alleen conceptfacturen mogen worden verwijderd.');
  }

  writeInvoices(invoices.filter((entry) => entry.id !== invoiceId));
}

export function markInvoiceAsSent(invoiceId: string): Invoice {
  const invoices = readInvoices();
  const invoiceIndex = invoices.findIndex((invoice) => invoice.id === invoiceId);

  if (invoiceIndex === -1) {
    throw new Error('Factuur niet gevonden.');
  }

  const existingInvoice = invoices[invoiceIndex];
  if (existingInvoice.status !== 'draft') {
    return existingInvoice;
  }

  const { invoiceNumber } = allocateInvoiceNumber();
  const timestamp = new Date().toISOString();

  const sentInvoice: Invoice = {
    ...existingInvoice,
    status: 'sent',
    invoiceNumber,
    finalizedAt: timestamp,
    sentAt: timestamp,
    updatedAt: timestamp,
  };

  invoices[invoiceIndex] = sentInvoice;
  writeInvoices(invoices);

  return sentInvoice;
}

export function markInvoiceAsPaid(invoiceId: string): Invoice {
  return updateInvoiceStatus(invoiceId, 'paid');
}

export function markInvoiceAsOverdue(invoiceId: string): Invoice {
  return updateInvoiceStatus(invoiceId, 'overdue');
}

export function mapInvoiceToFormValues(invoice: Invoice): InvoiceFormValues {
  return {
    customerId: invoice.customerId,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate ?? '',
    notes: invoice.notes ?? '',
    currency: invoice.currency,
    lines: invoice.lines.map((line) => ({
      sourceProductId: line.sourceProductId ?? '',
      description: line.description,
      quantity: line.quantity.toFixed(2).replace(/\.00$/, ''),
      unitPrice: centsToDecimalString(line.unitPriceCents),
    })),
  };
}

export function findInvoiceCustomerName(customerId: string): string {
  const customer = listCustomers().find((entry) => entry.id === customerId);
  return customer?.name ?? 'Onbekende klant';
}

export function getInvoiceCustomers() {
  return listCustomers();
}

export function getInvoiceProducts() {
  return listProducts();
}

export function formatInvoiceTotal(invoice: Invoice): string {
  return formatMoneyFromCents(invoice.totalCents, invoice.currency);
}

function updateInvoiceStatus(invoiceId: string, nextStatus: 'paid' | 'overdue'): Invoice {
  const invoices = readInvoices();
  const invoiceIndex = invoices.findIndex((invoice) => invoice.id === invoiceId);

  if (invoiceIndex === -1) {
    throw new Error('Factuur niet gevonden.');
  }

  const existingInvoice = invoices[invoiceIndex];
  if (existingInvoice.status === 'draft') {
    throw new Error('Verzend de factuur eerst voordat de status wordt aangepast.');
  }

  const updatedInvoice: Invoice = {
    ...existingInvoice,
    status: nextStatus,
    paidAt: nextStatus === 'paid' ? new Date().toISOString() : existingInvoice.paidAt,
    updatedAt: new Date().toISOString(),
  };

  invoices[invoiceIndex] = updatedInvoice;
  writeInvoices(invoices);

  return updatedInvoice;
}

function createLines(invoiceId: string, values: InvoiceFormValues): InvoiceLine[] {
  const totals = calculateInvoiceDraftTotals(values);

  return values.lines.map((line, index) => ({
    id: createLineId(index),
    invoiceId,
    sourceProductId: line.sourceProductId || null,
    description: line.description.trim(),
    quantity: totals.lines[index]?.quantity ?? 1,
    unitPriceCents: totals.lines[index]?.unitPriceCents ?? 0,
    lineTotalCents: totals.lines[index]?.lineTotalCents ?? 0,
    sortOrder: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function allocateInvoiceNumber() {
  const settings = readRuntimeSettings();
  const nextValue = settings.invoiceNumberNextValue;
  const invoiceNumber = `${settings.invoiceNumberPrefix}-${String(nextValue).padStart(4, '0')}`;

  writeRuntimeSettings({
    ...settings,
    invoiceNumberNextValue: nextValue + 1,
  });

  return {
    invoiceNumber,
    nextValue,
  };
}

function readRuntimeSettings(): RuntimeSettings {
  if (typeof window === 'undefined') {
    return {
      invoiceNumberPrefix: 'INV',
      invoiceNumberNextValue: 1,
    };
  }

  const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!rawValue) {
    return {
      invoiceNumberPrefix: 'INV',
      invoiceNumberNextValue: 1,
    };
  }

  try {
    return JSON.parse(rawValue) as RuntimeSettings;
  } catch {
    return {
      invoiceNumberPrefix: 'INV',
      invoiceNumberNextValue: 1,
    };
  }
}

function writeRuntimeSettings(settings: RuntimeSettings): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }
}

function readInvoices(): Invoice[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(INVOICES_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Invoice[];
  } catch {
    return [];
  }
}

function writeInvoices(invoices: Invoice[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  }
}

function createInvoiceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `invoice-${Date.now()}`;
}

function createLineId(index: number): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `invoice-line-${Date.now()}-${index}`;
}
