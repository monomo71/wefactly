import type { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'error';
}

export function Alert({ children, variant = 'default' }: AlertProps) {
  const variantClassName =
    variant === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-border bg-slate-50 text-slate-700';

  return <div className={['rounded-md border px-4 py-3 text-sm', variantClassName].join(' ')}>{children}</div>;
}
