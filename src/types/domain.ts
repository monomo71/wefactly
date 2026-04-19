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
