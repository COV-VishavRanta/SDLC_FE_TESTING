'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot='label'
      className={cn(
        'gap-2 text-sm leading-none font-medium text-[var(--label-color)] group-data-[disabled=true]:text-[var(--disabled-text)] peer-disabled:text-[var(--disabled-text)] flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
