import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const variantClassName =
    variant === 'secondary'
      ? 'border border-border bg-white text-foreground hover:bg-slate-50'
      : 'bg-primary text-primary-foreground hover:opacity-95';

  return (
    <button
      className={[
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClassName,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
