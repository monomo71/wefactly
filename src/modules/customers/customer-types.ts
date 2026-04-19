import type { Customer } from '@/types/domain';

export interface CustomerFormValues {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  registrationNumber: string;
  taxNumber: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  stateRegion: string;
  country: string;
}

export type CustomerValidationErrors = Partial<Record<keyof CustomerFormValues, string>>;

export interface CustomerRecord extends Customer {}

export const emptyCustomerFormValues: CustomerFormValues = {
  name: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  registrationNumber: '',
  taxNumber: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  city: '',
  stateRegion: '',
  country: 'NL',
};
