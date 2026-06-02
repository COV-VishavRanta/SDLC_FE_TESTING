import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'border-[var(--input-border)] bg-[var(--input-bg)] focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-[var(--input-radius)] border px-3 py-2 text-[14px] text-[var(--input-text)] shadow-none transition-[color,box-shadow] focus-visible:ring-3 aria-invalid:ring-3 placeholder:text-[var(--input-placeholder)] flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:bg-[var(--neutral-100)] disabled:border-[var(--gray-200)] disabled:text-[var(--disabled-text)] read-only:cursor-not-allowed read-only:opacity-60 read-only:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
