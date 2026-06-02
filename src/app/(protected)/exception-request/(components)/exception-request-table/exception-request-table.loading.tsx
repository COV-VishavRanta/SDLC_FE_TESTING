'use client';

import {
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { useTranslations } from 'next-intl';

const DEFAULT_SKELETON_ROWS = 5;

const SKELETON_WIDTHS = ['w-24', 'w-36', 'w-20', 'w-32', 'w-20'];
const COLUMN_COUNT = SKELETON_WIDTHS.length;

/* ── Reusable skeleton rows ── */
function ExceptionRequestTableSkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[75px] border-b border-border last:border-b-0'
    >
      {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => (
        <TableCell key={`skeleton-cell-${colIdx}`}>
          <Skeleton className={`${SKELETON_WIDTHS[colIdx] ?? 'w-20'} h-6 rounded-full`} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/**
 * Standalone loading skeleton used as a Suspense fallback for the entire table card.
 */
export function ExceptionRequestTableSkeleton() {
  const t = useTranslations('exceptionRequest');

  const COLUMN_HEADERS = [
    { label: t('table.columns.shipmentNo'), width: '160px' },
    { label: t('table.columns.campaignName'), width: '220px' },
    { label: t('table.columns.orderNumber'), width: '160px' },
    { label: t('table.columns.storeName'), width: '200px' },
    { label: t('table.columns.status'), width: '140px' },
  ];

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      {/* sr-only live region announces to screen readers that content is loading (WCAG 4.1.3) */}
      <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
        {t('table.loadingState')}
      </div>
      <div className='overflow-x-auto'>
        {/* aria-busy="true" marks the table as still loading (WCAG 4.1.2) */}
        <Table aria-busy='true' aria-label={t('table.caption')}>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {COLUMN_HEADERS.map(({ label, width }) => (
                // scope="col" associates header with its column (WCAG 1.3.1)
                <TableHead
                  key={label}
                  scope='col'
                  style={{ width }}
                  className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {/* aria-hidden hides decorative skeleton cells from screen readers (WCAG 1.3.1) */}
          <TableBody aria-hidden='true'>
            <ExceptionRequestTableSkeletonRows count={DEFAULT_SKELETON_ROWS} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/**
 * Inline skeleton rows rendered inside an existing `<TableBody>` when
 * new data is being fetched (e.g., on page change).
 */
export function ExceptionRequestTableInlineLoading({ rowCount }: { rowCount: number }) {
  const count = Math.max(rowCount, 1);
  return <ExceptionRequestTableSkeletonRows count={count} />;
}
