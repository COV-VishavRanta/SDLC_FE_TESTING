'use client';
import { cn } from '@/lib/utils';

import { ErrorBoundary } from '../error-boundary/error-boundary';
import { PageErrorFallback } from '../error-boundary/page-error-fallback';

interface HeaderBaseProps {
  children: React.ReactNode;
  className?: string;
}

function PageTitle({ children, className }: HeaderBaseProps) {
  return (
    <h1
      className={cn(
        'text-[24px] leading-normal font-[var(--font-weight-semibold)] text-[var(--neutral-900)] sm:text-[28px] sm:leading-[42px]',
        className,
      )}
    >
      {children}
    </h1>
  );
}

function PageDescription({ children, className }: HeaderBaseProps) {
  return (
    <p
      className={cn(
        'text-[14px] font-[var(--font-weight-regular)] leading-[20px] tracking-[-0.15px] text-[var(--neutral-500)] sm:leading-[21px]',
        className,
      )}
    >
      {children}
    </p>
  );
}

function PageHeader({ children, className }: HeaderBaseProps) {
  return <header className={cn('flex flex-col gap-2', className)}>{children}</header>;
}

function PageRoot({ children, className }: HeaderBaseProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-5 p-5 sm:gap-6 sm:p-6 lg:p-8', className)}>
      <ErrorBoundary fallback={<PageErrorFallback />}>{children}</ErrorBoundary>
    </div>
  );
}
export { PageDescription, PageHeader, PageRoot, PageTitle };
