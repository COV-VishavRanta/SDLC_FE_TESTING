'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';

import { cn } from '@/lib/utils';
import { RiCheckLine } from '@remixicon/react';
import React from 'react';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute('aria-hidden', 'true');
      inputRef.current.setAttribute('aria-label', props['aria-label'] ?? 'Select input');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef]);
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border-2 border-input border-primary shadow-xs transition-shadow outline-none group-has-disabled/field:text-[var(--disabled-text)] group-has-disabled/field:border-[var(--gray-200)] after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:text-[var(--disabled-text)] disabled:border-[var(--gray-200)] aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',
        className,
      )}
      inputRef={inputRef}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='grid place-content-center text-current transition-none [&>svg]:size-3.5'
      >
        <RiCheckLine />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
