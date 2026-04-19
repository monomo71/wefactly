import type { Customer } from '@/types/domain';
import type { CustomerFormValues } from '@/modules/customers/customer-types';

const CUSTOMERS_STORAGE_KEY = 'wefactly.customers';
const DEFAULT_ORGANIZATION_ID = 'single-tenant-organization';

export function listCustomers(): Customer[] {
  return readCustomers().sort((left, right) => left.name.localeCompare(right.name));
}

export function getCustomerById(customerId: string): Customer | null {
  return readCustomers().find((customer) => customer.id === customerId) ?? null;
}

export function createCustomer(values: CustomerFormValues): Customer {
  const now = new Date().toISOString();
  const nextCustomer: Customer = {
    id: createCustomerId(),
    organizationId: DEFAULT_ORGANIZATION_ID,
    name: values.name.trim(),
    contactName: values.contactName.trim() || null,
    email: values.email.trim() || null,
    phone: values.phone.trim() || null,
    website: values.website.trim() || null,
    registrationNumber: values.registrationNumber.trim() || null,
    taxNumber: values.taxNumber.trim() || null,
    addressLine1: values.addressLine1.trim() || null,
    addressLine2: values.addressLine2.trim() || null,
    postalCode: values.postalCode.trim() || null,
    city: values.city.trim() || null,
    stateRegion: values.stateRegion.trim() || null,
    country: values.country.trim() || 'NL',
    createdAt: now,
    updatedAt: now,
  };

  const customers = readCustomers();
  customers.push(nextCustomer);
  writeCustomers(customers);

  return nextCustomer;
}

export function updateCustomer(customerId: string, values: CustomerFormValues): Customer {
  const customers = readCustomers();
  const customerIndex = customers.findIndex((customer) => customer.id === customerId);

  if (customerIndex === -1) {
    throw new Error('Klant niet gevonden.');
  }

  const existingCustomer = customers[customerIndex];
  const updatedCustomer: Customer = {
    ...existingCustomer,
    name: values.name.trim(),
    contactName: values.contactName.trim() || null,
    email: values.email.trim() || null,
    phone: values.phone.trim() || null,
    website: values.website.trim() || null,
    registrationNumber: values.registrationNumber.trim() || null,
    taxNumber: values.taxNumber.trim() || null,
    addressLine1: values.addressLine1.trim() || null,
    addressLine2: values.addressLine2.trim() || null,
    postalCode: values.postalCode.trim() || null,
    city: values.city.trim() || null,
    stateRegion: values.stateRegion.trim() || null,
    country: values.country.trim() || 'NL',
    updatedAt: new Date().toISOString(),
  };

  customers[customerIndex] = updatedCustomer;
  writeCustomers(customers);

  return updatedCustomer;
}

export function mapCustomerToFormValues(customer: Customer): CustomerFormValues {
  return {
    name: customer.name,
    contactName: customer.contactName ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    website: customer.website ?? '',
    registrationNumber: customer.registrationNumber ?? '',
    taxNumber: customer.taxNumber ?? '',
    addressLine1: customer.addressLine1 ?? '',
    addressLine2: customer.addressLine2 ?? '',
    postalCode: customer.postalCode ?? '',
    city: customer.city ?? '',
    stateRegion: customer.stateRegion ?? '',
    country: customer.country,
  };
}

function readCustomers(): Customer[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Customer[];
  } catch {
    return [];
  }
}

function writeCustomers(customers: Customer[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  }
}

function createCustomerId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `customer-${Date.now()}`;
}
