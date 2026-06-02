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

import { pspColumns } from './psp-table-columns';

const DEFAULT_SKELETON_ROWS = 5;

/* ── Reusable skeleton rows ── */
function SkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[75px] border-b border-border last:border-b-0'
    >
      {pspColumns.map((col, colIdx) => {
        const key = 'accessorKey' in col && col.accessorKey ? col.accessorKey : col.id;
        let skeletonContent: React.ReactNode;

        switch (key) {
          case 'name':
            skeletonContent = <Skeleton className='h-5 w-36 rounded-full' />;
            break;
          case 'admins':
            skeletonContent = (
              <div className='flex flex-col gap-1.5'>
                <Skeleton className='h-4 w-16 rounded-full' />
                <div className='flex gap-1.5'>
                  <Skeleton className='h-6 w-24 rounded-md' />
                  <Skeleton className='h-6 w-20 rounded-md' />
                </div>
              </div>
            );
            break;
          case 'isActive':
            skeletonContent = <Skeleton className='h-6 w-16 rounded-full' />;
            break;
          case 'createdAt':
            skeletonContent = <Skeleton className='h-4 w-24 rounded-full' />;
            break;
          case 'actions':
            skeletonContent = (
              <div className='flex gap-1'>
                <Skeleton className='size-9 rounded-lg' />
                <Skeleton className='size-9 rounded-lg' />
                <Skeleton className='size-9 rounded-lg' />
              </div>
            );
            break;
          default:
            skeletonContent = <Skeleton className='h-5 w-20 rounded-full' />;
        }

        return <TableCell key={`${rowIdx}-${colIdx}`}>{skeletonContent}</TableCell>;
      })}
    </TableRow>
  ));
}

export function PspTableSkeleton() {
  const t = useTranslations('pspManagement');

  const COLUMN_HEADERS = [
    { label: t('table.columns.name'), maxWidth: '200px' },
    { label: t('table.columns.users'), maxWidth: '220px' },
    { label: t('table.columns.status'), maxWidth: '105px' },
    { label: t('table.columns.createdDate'), maxWidth: '130px' },
    { label: t('table.columns.actions'), maxWidth: '130px' },
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
              {COLUMN_HEADERS.map((col) => (
                // scope="col" associates header with its column (WCAG 1.3.1)
                <TableHead
                  key={col.label}
                  scope='col'
                  className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                  style={{ maxWidth: col.maxWidth }}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {/* aria-hidden hides decorative skeleton cells from screen readers (WCAG 1.3.1) */}
          <TableBody aria-hidden='true'>
            <SkeletonRows count={DEFAULT_SKELETON_ROWS} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/* ── Inline loading (used while transitioning between pages) ── */
export function PspTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <SkeletonRows count={rowCount || DEFAULT_SKELETON_ROWS} />;
}
