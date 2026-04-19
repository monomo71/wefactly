export interface SetupStatus {
  isInitialized: boolean;
}

export interface SetupFormValues {
  organizationName: string;
  adminFullName: string;
  adminEmail: string;
  password: string;
  registrationNumber: string;
  taxNumber: string;
  phone: string;
  website: string;
  city: string;
  country: string;
}

export interface SetupSnapshot {
  organizationName: string;
  adminFullName: string;
  adminEmail: string;
  registrationNumber: string;
  taxNumber: string;
  phone: string;
  website: string;
  city: string;
  country: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  email: string;
  fullName: string;
  organizationName: string;
}

export interface AuthSession {
  user: AuthenticatedUser;
  createdAt: string;
}

export type SetupValidationErrors = Partial<Record<keyof SetupFormValues, string>>;
export type LoginValidationErrors = Partial<Record<keyof LoginFormValues, string>>;
