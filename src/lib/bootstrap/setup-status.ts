import type { SetupStatus } from '@/types/auth';

const SETUP_COMPLETE_KEY = 'wefactly.setup.complete';

async function fetchSetupStatusFromBackend(): Promise<SetupStatus | null> {
  return null;
}

export async function getSetupStatus(): Promise<SetupStatus> {
  const backendStatus = await fetchSetupStatusFromBackend();
  if (backendStatus) {
    return backendStatus;
  }

  if (typeof window === 'undefined') {
    return { isInitialized: false };
  }

  return {
    isInitialized: window.localStorage.getItem(SETUP_COMPLETE_KEY) === 'true',
  };
}

export async function markSetupComplete(): Promise<void> {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SETUP_COMPLETE_KEY, 'true');
  }
}
