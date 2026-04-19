import type { Product } from '@/types/domain';
import type { ProductFormValues } from '@/modules/products/product-types';

const PRODUCTS_STORAGE_KEY = 'wefactly.products';
const DEFAULT_ORGANIZATION_ID = 'single-tenant-organization';

export function listProducts(): Product[] {
  return readProducts().sort((left, right) => left.name.localeCompare(right.name));
}

export function createProduct(values: ProductFormValues): Product {
  const now = new Date().toISOString();
  const nextProduct: Product = {
    id: createProductId(),
    organizationId: DEFAULT_ORGANIZATION_ID,
    name: values.name.trim(),
    sku: values.sku.trim() || null,
    description: values.description.trim() || null,
    unitLabel: values.unitLabel.trim() || 'piece',
    unitPrice: normalizePrice(values.unitPrice),
    currency: values.currency.trim().toUpperCase() || 'EUR',
    createdAt: now,
    updatedAt: now,
  };

  const products = readProducts();
  products.push(nextProduct);
  writeProducts(products);

  return nextProduct;
}

export function updateProduct(productId: string, values: ProductFormValues): Product {
  const products = readProducts();
  const productIndex = products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    throw new Error('Product niet gevonden.');
  }

  const existingProduct = products[productIndex];
  const updatedProduct: Product = {
    ...existingProduct,
    name: values.name.trim(),
    sku: values.sku.trim() || null,
    description: values.description.trim() || null,
    unitLabel: values.unitLabel.trim() || 'piece',
    unitPrice: normalizePrice(values.unitPrice),
    currency: values.currency.trim().toUpperCase() || 'EUR',
    updatedAt: new Date().toISOString(),
  };

  products[productIndex] = updatedProduct;
  writeProducts(products);

  return updatedProduct;
}

export function mapProductToFormValues(product: Product): ProductFormValues {
  return {
    name: product.name,
    sku: product.sku ?? '',
    description: product.description ?? '',
    unitLabel: product.unitLabel,
    unitPrice: product.unitPrice.toFixed(2),
    currency: product.currency,
  };
}

function normalizePrice(value: string): number {
  const parsedValue = Number(value.replace(',', '.'));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function readProducts(): Product[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as Product[];
  } catch {
    return [];
  }
}

function writeProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }
}

function createProductId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `product-${Date.now()}`;
}
