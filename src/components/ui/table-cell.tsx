'use no memo';

import {
  getExceptionRequestStatusStyles,
  getInstallationStatusStyles,
  getOrderStatusStyles,
  getShipmentStatusStyles,
  getSurveyStatusStyles,
  InstallationStatusEnum,
  OrderStatusEnum,
  PAGE_SIZE_OPTIONS,
  ShipmentReorderStatusEnum,
  ShipmentStatusEnum,
  SurveyStatusEnum,
} from '@/constant';
import {
  CampaignStatusEnum,
  CampaignTypeEnum,
  getCampaignStatusStyles,
} from '@/constant/enums/campaign.enums';
import { cn } from '@/lib/utils';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { Column, Table } from '@tanstack/react-table';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { MouseEventHandler } from 'react';
import { SortIcon } from '../icons/SortIcon';
import { Badge } from './badge';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  href?: string;
  disabled?: boolean;
}

function ActionCellContainer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex items-center gap-1', className)}>{children}</div>;
}

function ActionButtonCell({
  icon,
  tooltip,
  onClick,
  className,
  href,
  disabled,
}: ActionButtonProps) {
  const triggerElement = href ? (
    <Link
      href={href}
      aria-label={tooltip}
      aria-disabled={disabled}
      className={cn(
        'flex size-[38px] items-center justify-center rounded-lg transition-colors',
        className,
      )}
    >
      {icon}
    </Link>
  ) : (
    <Button
      variant='ghost'
      disabled={disabled}
      aria-label={tooltip}
      type='button'
      onClick={onClick}
      className={cn(
        'flex size-[38px] items-center justify-center rounded-lg transition-colors',
        className,
      )}
    >
      {icon}
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={triggerElement} />
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ── Status Badge Cell── */
function StatusBadgeCell({ isActive }: { isActive: boolean }) {
  const t = useTranslations('table.statusBadge');
  return (
    <Badge variant={isActive ? 'active' : 'inactive'}>
      {isActive ? t('active') : t('inactive')}
    </Badge>
  );
}

/** Translatable campaign status badge cell — must be a component to use hooks */
export function CampaignStatusCell({ status, className }: { status: string; className?: string }) {
  const t = useTranslations('campaignManagement.table.status');
  const enumStatus = Object.values(CampaignStatusEnum).includes(status as CampaignStatusEnum)
    ? (status as CampaignStatusEnum)
    : null;

  if (!enumStatus) {
    return <span className='text-[13px] leading-[19.5px] text-text-heading'>-</span>;
  }

  const style = getCampaignStatusStyles(enumStatus);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {t(enumStatus)}
    </Badge>
  );
}

/** Translatable order status badge cell — must be a component to use hooks */
export function OrderStatusCell({ status, className }: { status: string; className?: string }) {
  const t = useTranslations('orderManagement.table.status');
  const enumStatus = Object.values(OrderStatusEnum).includes(status as OrderStatusEnum)
    ? (status as OrderStatusEnum)
    : null;

  if (!enumStatus) {
    return <span className='text-[13px] leading-[19.5px] text-text-heading'>-</span>;
  }

  const style = getOrderStatusStyles(enumStatus);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {t(enumStatus)}
    </Badge>
  );
}

/** Translatable shipment status badge cell — must be a component to use hooks */
export function ShipmentStatusCell({ status, className }: { status: string; className?: string }) {
  const t = useTranslations('shipments');

  if (!status) return <span>-</span>;

  const isKnownStatus = status in ShipmentStatusEnum;

  const label = isKnownStatus
    ? t(`table.statusLabels.${status as keyof typeof ShipmentStatusEnum}`)
    : status;
  const enumStatus = Object.values(ShipmentStatusEnum).includes(status as ShipmentStatusEnum)
    ? (status as ShipmentStatusEnum)
    : null;

  if (!enumStatus) {
    return <span className='text-[13px] leading-[19.5px] text-text-heading'>-</span>;
  }

  const style = getShipmentStatusStyles(enumStatus);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </Badge>
  );
}

/** Translatable survey status badge cell — must be a component to use hooks */
function SurveyStatusBadge({
  status,
  className,
}: {
  status: SurveyStatusEnum;
  className?: string;
}) {
  const t = useTranslations('surveyManagement');

  if (!status) return <span>-</span>;

  const enumStatus = Object.values(SurveyStatusEnum).includes(status as SurveyStatusEnum)
    ? (status as SurveyStatusEnum)
    : null;

  if (!enumStatus) {
    return <span className='text-[13px] leading-[19.5px] text-text-heading'>-</span>;
  }

  const isKnownStatus = status in SurveyStatusEnum;
  const label = isKnownStatus
    ? t(`table.statusLabels.${status as keyof typeof SurveyStatusEnum}`)
    : status;

  const style = getSurveyStatusStyles(enumStatus);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </Badge>
  );
}

/** Translatable installation status badge cell — must be a component to use hooks */
export function InstallationStatusBadge({
  status,
  className,
}: {
  status: InstallationStatusEnum;
  className?: string;
}) {
  const t = useTranslations('installationManagement');

  if (!status) return <span>-</span>;

  const enumStatus = Object.values(InstallationStatusEnum).includes(
    status as InstallationStatusEnum,
  )
    ? (status as InstallationStatusEnum)
    : null;

  if (!enumStatus) {
    return <span className='text-[13px] leading-[19.5px] text-text-heading'>-</span>;
  }

  const isKnownStatus = status in InstallationStatusEnum;
  const label = isKnownStatus
    ? t(`table.statusLabels.${status as keyof typeof InstallationStatusEnum}`)
    : status;

  const style = getInstallationStatusStyles(enumStatus);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </Badge>
  );
}

/** Translatable exception request status badge cell — must be a component to use hooks */
export function ExceptionRequestStatusCell({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const t = useTranslations('exceptionRequest');

  if (!status) return <span>-</span>;

  const enumStatus = Object.values(ShipmentReorderStatusEnum).includes(
    status as ShipmentReorderStatusEnum,
  )
    ? (status as ShipmentReorderStatusEnum)
    : null;

  if (!enumStatus) {
    return <span className='text-[13px] leading-[19.5px] text-text-heading'>-</span>;
  }

  const isKnownStatus = status in ShipmentReorderStatusEnum;
  const label = isKnownStatus
    ? t(`table.statusLabels.${status as keyof typeof ShipmentReorderStatusEnum}`)
    : status;

  const style = getExceptionRequestStatusStyles(enumStatus);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
      }}
    >
      {label}
    </Badge>
  );
}

/* ── Sortable Header ── */
function SortableHeader<T>({
  children,
  column,
}: {
  children: React.ReactNode;
  column?: Column<T, unknown>;
}) {
  if (!column) {
    return <span className='uppercase'>{children}</span>;
  }

  const isSorted = column.getIsSorted();
  const isAscending = isSorted === 'asc';

  return (
    <button
      type='button'
      onClick={() => column.toggleSorting(isAscending)}
      className={cn(
        'flex gap-1.5 group select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-[var(--focus-border)] text-left focus-visible:ring-offset-2 rounded-sm',
      )}
    >
      <span className='uppercase'>{children}</span>
      {/* aria-hidden: visual sort indicator — sort state communicated via aria-sort on <th> (WCAG 1.1.1) */}
      <SortIcon
        aria-hidden='true'
        className={cn(
          'size-3.5 text-text-secondary transition-all min-w-6',
          isAscending && 'rotate-180',
          isSorted ? 'opacity-100' : 'opacity-50 group-hover:opacity-100',
        )}
      />
    </button>
  );
}

/* ── Created Date Cell── */
function CreatedDateCell({ value }: { value?: string | Date }) {
  const locale = useLocale();
  const formatted = value
    ? new Date(value).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '-';
  return (
    <span className='flex items-center gap-1.5 text-sm text-text-secondary'>
      {/* aria-hidden: decorative calendar icon — date text is the accessible content (WCAG 1.1.1) */}

      {formatted}
    </span>
  );
}

type PageItem = number | 'ellipsis';

function getVisiblePages(totalPages: number, currentPage: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  for (let i = 1; i <= 2; i++) pages.add(i);
  for (let i = totalPages - 1; i <= totalPages; i++) pages.add(i);
  for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
    pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: PageItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    result.push(sorted[i]!);
    if (i < sorted.length - 1 && sorted[i + 1]! - sorted[i]! > 1) {
      result.push('ellipsis');
    }
  }
  return result;
}

interface TablePaginationProps<T> {
  table: Table<T>;
  totalCount: number;
  startRow: number;
  endRow: number;
  entityLabel: string;
  pageSizeOptions?: readonly number[];
}

function TablePagination<T>({
  table,
  totalCount,
  startRow,
  endRow,
  entityLabel,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: TablePaginationProps<T>) {
  const t = useTranslations('table.pagination');
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalPages = table.getPageCount();
  const currentPage = pageIndex + 1;

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <>
      {/* Left: showing X–Y of Z entity */}
      <div aria-live='polite' className='shrink-0 text-sm text-[var(--neutral-500)] mb-0'>
        {t.rich('showing', {
          start: startRow,
          end: endRow,
          total: totalCount,
          entity: entityLabel,
          bold: (chunks) => <span className='font-medium text-[var(--neutral-800)]'>{chunks}</span>,
        })}
      </div>

      {/* Right side: rows-per-page selector + page number buttons */}
      <div className='flex flex-wrap items-center justify-center gap-3 sm:justify-start sm:gap-[var(--pagination-section-gap,32px)]'>
        {/* Rows per page */}
        <div className='flex items-center gap-2'>
          <span className='whitespace-nowrap text-sm font-medium text-[var(--neutral-900)]'>
            {t('rowsPerPage')}
          </span>
          <Select
            aria-label={t('rowsPerPageAria')}
            value={String(pageSize)}
            onValueChange={(value) => {
              if (value !== null && value !== undefined) table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              aria-label={t('rowsPerPageAria')}
              className='!h-[33px] w-[80px] rounded-[var(--pagination-select-radius,8px)] border border-[var(--pagination-border)] bg-[var(--neutral-200)] px-3 py-0 text-[var(--neutral-800)] text-sm'
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align='center' alignItemWithTrigger={false}>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page number navigation */}
        <div
          role='navigation'
          aria-label={t('navigationAriaLabel')}
          className='flex flex-wrap items-center gap-[var(--pagination-gap,8px)]'
        >
          {/* Previous button */}
          <button
            type='button'
            aria-label={t('previousAriaLabel')}
            onClick={() => table.previousPage()}
            disabled={!canPrev}
            className={cn(
              'flex shrink-0 items-center justify-center rounded-[var(--pagination-btn-radius,4px)]',
              'size-[var(--pagination-btn-size,32px)]',
              canPrev
                ? 'border border-[var(--pagination-border)] bg-white text-[var(--neutral-700)] hover:bg-[var(--neutral-200)]'
                : 'cursor-not-allowed bg-[var(--pagination-disabled-bg)] opacity-50',
            )}
          >
            <RiArrowLeftSLine className='size-4' />
          </button>

          {/* Page number buttons */}
          {getVisiblePages(totalPages, currentPage).map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden
                className={
                  'flex size-[var(--pagination-btn-size,32px)] shrink-0 items-center justify-center rounded-[var(--pagination-btn-radius,4px)] border border-[var(--pagination-border)] bg-white text-sm font-bold text-[#212b36]'
                }
              >
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                type='button'
                aria-label={t('pageAria', { page: item })}
                aria-current={item === currentPage ? 'page' : undefined}
                onClick={() => table.setPageIndex(item - 1)}
                className={cn(
                  'flex size-[var(--pagination-btn-size,32px)] shrink-0 items-center justify-center rounded-[var(--pagination-btn-radius,4px)] text-sm font-medium',
                  item === currentPage
                    ? 'border border-[var(--pagination-active-border)] bg-white text-[var(--pagination-active-text)]'
                    : 'border border-[var(--pagination-border)] bg-white text-[var(--neutral-800)] hover:bg-[var(--neutral-200)]',
                )}
              >
                {item}
              </button>
            ),
          )}

          {/* Next button */}
          <button
            type='button'
            aria-label={t('nextAriaLabel')}
            onClick={() => table.nextPage()}
            disabled={!canNext}
            className={cn(
              'flex shrink-0 items-center justify-center rounded-[var(--pagination-btn-radius,4px)]',
              'size-[var(--pagination-btn-size,32px)]',
              canNext
                ? 'border border-[var(--pagination-border)] bg-white text-[var(--neutral-700)] hover:bg-[var(--neutral-200)]'
                : 'cursor-not-allowed bg-[var(--pagination-disabled-bg)] opacity-50',
            )}
          >
            <RiArrowRightSLine className='size-4' />
          </button>
        </div>
      </div>
    </>
  );
}

/** Translatable type cell — must be a component to use hooks */
function CampaignTypeCell({ isPermanent }: { isPermanent: boolean }) {
  const t = useTranslations('campaignManagement.table.type');
  const key = isPermanent ? CampaignTypeEnum.PERMANENT : CampaignTypeEnum.ONE_OFF;
  return (
    <span className='text-[13px] leading-[19.5px] tracking-[-0.08px] text-text-heading'>
      {t(key)}
    </span>
  );
}

interface AdminCountCellProps {
  firstAdminName?: string;
  remainingCount: number;
}

/* ── Admin Count Cell── */

function AdminCountCell({ firstAdminName, remainingCount }: AdminCountCellProps) {
  const t = useTranslations('table.columns');
  return (
    <div className='flex flex-col gap-1'>
      {/*  eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      <span className='text-sm text-text-secondary'>{firstAdminName || '—'}</span>
      {remainingCount > 0 && (
        <span className='text-sm font-medium text-table-link'>
          +{remainingCount} {t('andMore')}
        </span>
      )}
    </div>
  );
}
export {
  ActionButtonCell,
  ActionCellContainer,
  AdminCountCell,
  CampaignTypeCell,
  CreatedDateCell,
  SortableHeader,
  StatusBadgeCell,
  SurveyStatusBadge,
  TablePagination,
};
