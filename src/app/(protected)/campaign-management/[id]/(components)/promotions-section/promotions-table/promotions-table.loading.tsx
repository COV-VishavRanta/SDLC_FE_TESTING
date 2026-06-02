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

const DEFAULT_SKELETON_ROWS = 5;

const COLUMN_HEADERS = [
  { label: 'PROMOTION NAME', minWidth: '280px' },
  { label: 'STORES', minWidth: '100px' },
  { label: 'DISTRIBUTED QTY', minWidth: '130px' },
  { label: 'REUSABLE', minWidth: '100px' },
  { label: 'ACTIONS', minWidth: '160px' },
];

/* ── Reusable skeleton rows ── */
function SkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`promotion-skeleton-row-${rowIdx}`}
      className='h-[77px] border-b border-border last:border-b-0'
    >
      {/* Name */}
      <TableCell className='px-5'>
        <Skeleton className='h-4 w-44 rounded-full' />
      </TableCell>
      {/* Stores */}
      <TableCell className='px-5'>
        <Skeleton className='h-4 w-10 rounded-full' />
      </TableCell>
      {/* Distributed Qty */}
      <TableCell className='px-5'>
        <Skeleton className='h-4 w-10 rounded-full mx-auto' />
      </TableCell>
      {/* Reusable */}
      <TableCell className='px-5'>
        <Skeleton className='h-4 w-8 rounded-full mx-auto' />
      </TableCell>
      {/* Actions */}
      <TableCell className='px-5'>
        <div className='flex justify-end gap-1'>
          <Skeleton className='size-8 rounded-lg' />
          <Skeleton className='size-8 rounded-lg' />
          <Skeleton className='size-8 rounded-lg' />
        </div>
      </TableCell>
    </TableRow>
  ));
}

export function PromotionsTableSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {/* Section Header Skeleton */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-7 w-40 rounded-full' />
        <div className='flex items-center gap-2 sm:gap-3'>
          <Skeleton className='h-[43px] w-48 rounded-lg' />
          <Skeleton className='h-[41px] w-40 rounded-lg' />
        </div>
      </div>

      <Card className='overflow-clip rounded-xl border border-border p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
                {COLUMN_HEADERS.map((col) => (
                  <TableHead
                    key={col.label}
                    scope='col'
                    className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                    style={{ minWidth: col.minWidth }}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <SkeletonRows count={DEFAULT_SKELETON_ROWS} />
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

/* ── Inline loading (used while transitioning between pages) ── */
export function PromotionsTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <SkeletonRows count={rowCount || DEFAULT_SKELETON_ROWS} />;
}
