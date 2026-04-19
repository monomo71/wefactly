import { markSetupComplete } from '@/lib/bootstrap/setup-status';
import { validateSetupForm } from '@/lib/validation/setup-schema';
import type { SetupFormValues, SetupSnapshot } from '@/types/auth';

const SETUP_SNAPSHOT_KEY = 'wefactly.setup.snapshot';

export async function submitInitialSetup(values: SetupFormValues): Promise<void> {
  const errors = validateSetupForm(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Vul eerst alle verplichte setupvelden correct in.');
  }

  const snapshot: SetupSnapshot = {
    organizationName: values.organizationName.trim(),
    adminFullName: values.adminFullName.trim(),
    adminEmail: values.adminEmail.trim(),
    registrationNumber: values.registrationNumber.trim(),
    taxNumber: values.taxNumber.trim(),
    phone: values.phone.trim(),
    website: values.website.trim(),
    city: values.city.trim(),
    country: values.country.trim(),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SETUP_SNAPSHOT_KEY, JSON.stringify(snapshot));
  }

  await markSetupComplete();
}

export function getSetupSnapshot(): SetupSnapshot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(SETUP_SNAPSHOT_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as SetupSnapshot;
  } catch {
    return null;
  }
}
