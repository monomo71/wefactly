import type { Product } from '@/types/domain';

export interface ProductFormValues {
  name: string;
  sku: string;
  description: string;
  unitLabel: string;
  unitPrice: string;
  currency: string;
}

export type ProductValidationErrors = Partial<Record<keyof ProductFormValues, string>>;

export interface ProductRecord extends Product {}

export const emptyProductFormValues: ProductFormValues = {
  name: '',
  sku: '',
  description: '',
  unitLabel: 'piece',
  unitPrice: '0.00',
  currency: 'EUR',
};
