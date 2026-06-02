'use client';

import {
  AlertRow,
  Card,
  CloseIcon,
  Input,
  NoRecordFound,
  SearchIcon,
  TablePagination,
} from '@/components';
import { TableFooter } from '@/components/ui/table';
import { AlertType, NotificationTypeEnum } from '@/constant';
import { NotificationType } from '@/types';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

import { AlertsContext } from '../../context/AlertsContext';

/* ── Empty column definitions — table is used only for pagination control ── */
const ALERT_COLUMNS: ColumnDef<NotificationType>[] = [];

/* ── Notification type codes for title translation ── */
const NOTIFICATION_TYPE_VALUES = new Set<string>(Object.values(NotificationTypeEnum));

// ── Main component ──────────────────────────────────────────────────────────

export default function AlertsList() {
  const t = useTranslations('alerts');

  const getAlertTitle = (title: string) =>
    NOTIFICATION_TYPE_VALUES.has(title)
      ? t(`notificationTypes.${title as NotificationTypeEnum}`)
      : title;
  const {
    alertsList,
    paginationInfo,
    loading,
    pagination,
    setPagination,
    searchQuery,
    updateSearch,
    clearSearch,
  } = useContext(AlertsContext);

  /* ── TanStack table — purely for pagination control ── */
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<NotificationType>({
    data: alertsList,
    columns: ALERT_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 0,
    rowCount: paginationInfo?.totalCount,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  /* ── Pagination calculations ── */
  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);

  const isEmpty = alertsList.length === 0;
  const emptyMessage = t('list.empty');

  const alertRows = useMemo(() => alertsList, [alertsList]);

  return (
    <div className='flex flex-col gap-6'>
      {/* Search input */}
      <div className='relative w-full max-w-[600px]'>
        <div className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary'>
          <SearchIcon className='size-4' aria-hidden='true' />
        </div>
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => {
            updateSearch(e.target.value);
            updateSearch(e.target.value);
          }}
          placeholder={t('search.placeholder')}
          className='pl-9 pr-9 text-sm bg-white'
          aria-label={t('search.placeholder')}
        />
        {searchQuery && (
          <button
            type='button'
            onClick={clearSearch}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-heading focus:outline-none'
            aria-label={t('search.clearAriaLabel')}
          >
            <CloseIcon className='size-4' />
          </button>
        )}
      </div>

      {/* sr-only live region announces loading state to screen readers (WCAG 4.1.3) */}
      <div aria-live='polite' aria-atomic='true' className='sr-only'>
        {loading ? t('list.loadingState') : ''}
      </div>

      {/* Alerts card */}
      <Card
        className='overflow-hidden rounded-[8px] border border-[var(--neutral-300)] bg-[var(--neutral-100)] p-0'
        aria-busy={loading}
      >
        <div className='p-6'>
          {isEmpty ? (
            <NoRecordFound message={emptyMessage} />
          ) : (
            <div className='flex flex-col gap-2' role='list' aria-label={t('list.caption')}>
              {alertRows.map((alert) => (
                <AlertRow
                  key={alert.id}
                  type={AlertType.WARNING}
                  title={getAlertTitle(alert.title)}
                  description={alert.message}
                  viewAction={null}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <TableFooter role='navigation' aria-label={t('list.paginationAriaLabel')}>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('list.paginationLabel')}
          />
        </TableFooter>
      </Card>
    </div>
  );
}
