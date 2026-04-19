import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ children, className = '', variant = 'primary', isLoading = false, disabled, ...props }: ButtonProps) {
  const variantClassName =
    variant === 'secondary'
      ? 'border border-border bg-white text-foreground hover:bg-slate-50'
      : 'bg-primary text-primary-foreground hover:opacity-95';

  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60',
        variantClassName,
        className,
      ].join(' ')}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  );
}
