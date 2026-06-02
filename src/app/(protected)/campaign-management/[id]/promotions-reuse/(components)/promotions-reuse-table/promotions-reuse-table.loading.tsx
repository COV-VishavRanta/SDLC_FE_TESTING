'use client';

import {
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';

const DEFAULT_SKELETON_ROWS = 5;

const COLUMN_HEADERS: { label: string; width?: string; minWidth?: string }[] = [
  { label: 'SELECT', width: '44px' },
  { label: 'PROMOTION NAME', minWidth: '200px' },
  { label: 'HEIGHT' },
  { label: 'WIDTH' },
  { label: 'MATERIAL' },
  { label: 'PHOTO' },
  { label: 'ACTIONS', width: '80px' },
];

function getSkeletonClass(label: string): string {
  switch (label) {
    case 'SELECT':
      return 'h-4 w-4 rounded';
    case 'PROMOTION NAME':
      return 'h-5 w-40 rounded-full';
    case 'HEIGHT':
    case 'WIDTH':
      return 'h-5 w-10 rounded-full';
    case 'MATERIAL':
      return 'h-5 w-24 rounded-full';
    case 'PHOTO':
      return 'h-5 w-16 rounded-full';
    case 'ACTIONS':
      return 'h-8 w-8 rounded ml-auto';
    default:
      return 'h-5 w-20 rounded-full';
  }
}

function SkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[56px] border-b border-border last:border-b-0'
    >
      {COLUMN_HEADERS.map(({ label }, colIdx) => (
        <TableCell key={`skeleton-cell-${colIdx}`}>
          <Skeleton className={getSkeletonClass(label)} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function PromotionsReuseTableSkeleton() {
  return (
    <>
      <Card className='overflow-clip rounded-xl border border-border p-0'>
        {/* Search bar */}
        <div className='flex justify-end border-b border-border px-4 py-3'>
          <Skeleton className='h-9 w-full max-w-xs rounded-lg' />
        </div>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
                {COLUMN_HEADERS.map(({ label, width, minWidth }) => (
                  <TableHead
                    key={label}
                    scope='col'
                    style={{ width, minWidth }}
                    className='h-11 text-xs font-semibold uppercase tracking-wide text-text-secondary'
                  >
                    {label === 'SELECT' ? '' : label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <SkeletonRows count={DEFAULT_SKELETON_ROWS} />
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <TableFooter>
          <div className='flex items-center justify-between px-4 py-3'>
            <Skeleton className='h-5 w-40 rounded-full' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded' />
              <Skeleton className='h-8 w-8 rounded' />
            </div>
          </div>
        </TableFooter>
      </Card>

      {/* Action buttons */}
      <div className='flex justify-end gap-3'>
        <Skeleton className='h-9 w-24 rounded-lg' />
        <Skeleton className='h-9 w-36 rounded-lg' />
      </div>
    </>
  );
}

export function PromotionsReuseTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <SkeletonRows count={Math.max(rowCount, 1)} />;
}
