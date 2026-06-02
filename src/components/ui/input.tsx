import { Input as InputPrimitive } from '@base-ui/react/input';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'w-full min-w-0 outline-none border bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] transition-all focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3 focus-visible:outline-none disabled:opacity-100 disabled:cursor-not-allowed read-only:cursor-not-allowed read-only:opacity-60 read-only:bg-transparent aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50',
  {
    variants: {
      variant: {
        default: 'border-[var(--input-border)]',
        error:
          'border-[var(--error)] bg-[#FEF2F2]/30 focus-visible:border-[var(--error)] aria-invalid:border-[var(--error)]',
        success: 'border-[var(--success)] bg-[#F0FDF4]/30 focus-visible:border-[var(--success)]',
      },
      inputSize: {
        sm: 'h-8 px-3 rounded-[var(--input-radius)] text-sm',
        md: 'h-12 px-4 rounded-[var(--input-radius)] text-base',
        lg: 'h-12 px-4 rounded-[var(--input-radius)] text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  },
);

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>, VariantProps<typeof inputVariants> {}

function Input({ className, variant, inputSize, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot='input'
      className={cn(inputVariants({ variant, inputSize }), className)}
      {...props}
    />
  );
}

export { Input, type InputProps };
