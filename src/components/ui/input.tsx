import type { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;

  return (
    <input
      className={[
        'w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
        className,
      ].join(' ')}
      {...rest}
    />
  );
}
