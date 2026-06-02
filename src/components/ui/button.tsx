'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const buttonVariants = cva(
  "focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-[10px] border border-transparent bg-clip-padding text-base font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] [&_svg:not([class*='size-'])]:size-4 inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:text-[var(--disabled-text)] [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none px-4 py-3 sm:py-6 min-h-10",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-[#005C8A] to-[#0077B3] text-white hover:from-[#0077B3] hover:to-[#005F8C] disabled:from-gray-300 disabled:to-gray-300 disabled:text-white focus:border-none',
        outline:
          'border-2 border-[#E1E6EB] bg-transparent text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-[var(--disabled-text)]',
        secondary:
          'bg-secondary bg-gradient-to-b text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground from-[#6B7280] to-[#4B5563] text-[14px] font-semibold text-white hover:from-[#4B5563] hover:to-[#374151]',
        ghost: 'border-none bg-transparent text-[#005C8A] disabled:text-[var(--disabled-text)]',
        destructive:
          'border-dialog-warning-text bg-dialog-delete-bg text-[14px] font-bold text-white hover:bg-[#e04545] focus:border-none',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-10 gap-1.5 px-4 in-data-[slot=button-group]:rounded-[10px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        xs: "h-6 gap-1 rounded-[8px] px-2 text-xs in-data-[slot=button-group]:rounded-[8px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 rounded-[10px] px-3 text-sm in-data-[slot=button-group]:rounded-[10px] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        lg: 'h-12 gap-2 px-6 text-lg has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        icon: 'size-10',
        'icon-xs':
          "size-6 rounded-[8px] in-data-[slot=button-group]:rounded-[8px] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-[10px] in-data-[slot=button-group]:rounded-[10px]',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const LoadingSpinner = () => (
  <svg
    className='animate-spin size-4'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    aria-hidden='true'
  >
    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='3' />
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
);

interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </ButtonPrimitive>
  );
}

/* ─── Quick Action Button for dashboard ─── */
function QuickActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={label}
      className='flex h-full min-h-[124px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-100)] px-6 py-6 transition-colors hover:border-[var(--primary-500)] hover:bg-[var(--neutral-200)]'
    >
      <div
        className='flex size-12 items-center justify-center rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)]'
        aria-hidden='true'
      >
        {icon}
      </div>
      <span className='text-[12px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
        {label}
      </span>
    </button>
  );
}

function ImagePreviewButton({ imageUrl }: { imageUrl: string }) {
  const [loaded, setLoaded] = useState(false);

  return imageUrl ? (
    <>
      <button
        type='button'
        onClick={() => window.open(imageUrl, '_blank', 'noopener,noreferrer')}
        className='group block size-20 shrink-0 overflow-hidden rounded-[6px] border border-[#e5e7eb] bg-white transform-gpu'
        aria-label='View Photo'
      >
        {!loaded && (
          <div className='inset-0 animate-pulse rounded-[inherit] bg-[var(--neutral-400)]' />
        )}
        <Image
          width={150}
          height={150}
          src={imageUrl}
          alt=''
          className={cn(
            'size-full object-cover transition-all duration-200',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setLoaded(true)}
        />
      </button>
    </>
  ) : (
    <p className='text-[14px] font-medium leading-5 text-[#0a0a0a]'>-</p>
  );
}
export {
  Button,
  buttonVariants,
  // custom
  ImagePreviewButton,
  QuickActionButton,
};
