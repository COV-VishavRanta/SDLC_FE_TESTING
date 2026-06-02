'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { CloseIcon } from '../icons/CloseIcon';
import { FilterIcon } from '../icons/FilterIcon';
import { SearchIcon } from '../icons/SearchIcon';

type Props = {
  children: React.ReactNode;
  className?: string;
};

function PageControls({ children, className }: Props) {
  return (
    <Card
      className={cn(
        'flex flex-row flex-wrap items-center gap-3 rounded-xl border border-border bg-page-control p-4 shadow-none wide:flex-nowrap wide:gap-4 wide:p-6',
        className,
      )}
    >
      {children}
    </Card>
  );
}

function PageSearch({
  className,
  inputClassName,
  onClear,
  ...props
}: React.ComponentProps<typeof Input> & {
  inputClassName?: string;
  onClear?: () => void;
}) {
  const hasValue = Boolean(props.value);

  return (
    <div className={cn('relative w-full wide:min-w-[200px] wide:flex-1', className)}>
      {/* Search icon */}
      <div className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary'>
        <SearchIcon className='size-[18px]' />
      </div>

      {/* Input */}
      <Input
        {...props}
        aria-label={props['aria-label'] ?? props.placeholder ?? 'Search'}
        placeholder={props.placeholder ?? 'Search...'}
        className={cn(
          'h-10 rounded-lg border-border bg-admin-tag-bg pl-12 text-[13px] placeholder:text-text-muted sm:h-[47px] sm:text-[14px]',
          hasValue && onClear ? 'pr-10' : '',
          inputClassName,
        )}
      />

      {/* Clear button */}
      {hasValue && onClear ? (
        <button
          type='button'
          aria-label='Clear search'
          onClick={onClear}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary transition-colors hover:text-text-heading cursor-pointer'
        >
          <CloseIcon className='size-[18px]' />
        </button>
      ) : null}
    </div>
  );
}

function PagePrimaryAction({ children, className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        'h-8 gap-1.5 whitespace-nowrap px-3 text-[16px] sm:h-[47px] sm:gap-2 sm:px-6 sm:text-[16px]',
        className,
      )}
    >
      {children}
    </Button>
  );
}

type PageFiltersProps = {
  children: React.ReactNode;
  className?: string;
};

function PageFilters({ children, className }: PageFiltersProps) {
  return (
    <Card className={cn('rounded-xl border border-border bg-white p-6 shadow-none', className)}>
      <Accordion defaultValue={['']}>
        <AccordionItem value='filters' className='border-none'>
          <div className='space-y-4'>{children}</div>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}

type PageFiltersToggleProps = {
  className?: string;
};

function PageFiltersToggle({ className }: PageFiltersToggleProps) {
  return (
    <AccordionTrigger
      className={cn(
        'h-10 w-full gap-2 rounded-lg border border-border bg-white px-4 transition-colors hover:bg-muted sm:h-[47px] sm:w-auto sm:min-w-[133px] sm:px-5 items-center [&[data-state=open]>svg]:rotate-0 hover:no-underline',
        className,
      )}
    >
      <div className='flex items-center justify-center gap-2'>
        <FilterIcon className='size-[18px]' />
        <span className='text-sm font-medium leading-[21px] text-text-heading underline-none'>
          Filters
        </span>
      </div>
    </AccordionTrigger>
  );
}

type PageFiltersContentProps = {
  children: React.ReactNode;
  className?: string;
};

function PageFiltersContent({ children, className }: PageFiltersContentProps) {
  return (
    <AccordionContent className={cn('border-t border-border pt-4 px-1', className)}>
      {children}
    </AccordionContent>
  );
}

type PageResetButtonProps = {
  onClick: () => void;
  className?: string;
};

function PageResetButton({ onClick, className }: PageResetButtonProps) {
  const t = useTranslations('common');

  return (
    <Button
      aria-label={t('resetFiltersAriaLabel')}
      variant='outline'
      onClick={onClick}
      className={cn(
        'h-10 w-full md:w-auto shrink-0 rounded-lg border-[var(--primary-500)] bg-transparent px-6 text-base font-medium bg-gradient-to-b from-[var(--primary-500)] to-[var(--primary-600)] bg-clip-text text-transparent hover:opacity-80 sm:h-[47px]',
        className,
      )}
    >
      {t('resetFilters')}
    </Button>
  );
}

export {
  PageControls,
  PageFilters,
  PageFiltersContent,
  PageFiltersToggle,
  PagePrimaryAction,
  PageResetButton,
  PageSearch,
};
