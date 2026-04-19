import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
      {children}
    </span>
  );
}
