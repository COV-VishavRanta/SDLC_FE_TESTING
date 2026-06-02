import * as React from 'react';

import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  iconBgClass: string;
  value?: number;
  label: string;
  /** Override the value text color/style, e.g. for coloured stat values */
  valueClassName?: string;
}

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' }) {
  return (
    <div
      data-slot='card'
      data-size={size}
      className={cn(
        'ring-foreground/10 bg-card text-card-foreground gap-0 rounded-lg text-sm shadow-none ring-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl group/card flex flex-col border border-[var(--gray-200)] px-6 py-6',
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className={cn(
        'gap-1 rounded-t-xl px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4 group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn(
        'text-base leading-normal font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('px-6 group-data-[size=sm]/card:px-4', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn(
        'rounded-b-xl px-6 group-data-[size=sm]/card:px-4 flex items-center',
        className,
      )}
      {...props}
    />
  );
}

function StatCard({ label, value, icon, iconBgClass, valueClassName }: StatCardProps) {
  return (
    <Card className='flex flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-none'>
      <div className='flex items-center justify-between'>
        <p className='text-[12px] sm:text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[var(--neutral-500)]'>
          {label}
        </p>
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-[9px]',
            iconBgClass,
          )}
        >
          {icon}
        </div>
      </div>
      <p
        className={cn(
          'text-[24px] sm:text-[32px] font-semibold leading-normal text-text-heading',
          valueClassName,
        )}
      >
        {value ?? '—'}
      </p>
    </Card>
  );
}

interface InfoCardProps {
  label: string;
  value: string | React.ReactNode;
}

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className='flex flex-1 flex-col gap-1.5 rounded-xl border border-border bg-white px-4 py-3 sm:gap-2 sm:px-6 sm:py-5'>
      <p className='text-[10px] font-medium uppercase leading-4 tracking-[-0.15px] text-[var(--neutral-500)] sm:text-xs sm:leading-5'>
        {label}
      </p>
      <p className='text-sm font-medium leading-5 tracking-[-0.15px] text-text-heading sm:text-base'>
        {value}
      </p>
    </div>
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  // custom
  InfoCard,
  StatCard,
};
