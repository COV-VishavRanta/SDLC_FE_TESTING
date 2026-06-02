'use client';

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';

const DEFAULT_SKELETON_ROWS = 3;

const COLUMN_HEADERS = [
  { label: 'STORE NAME', className: 'w-full' },
  { label: 'QTY', className: 'w-24' },
];

function StoreTableSkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, rowIdx) => (
    <TableRow
      key={`store-skeleton-row-${rowIdx}`}
      className='h-[45px] border-b border-[#e1e6eb] last:border-b-0'
    >
      <TableCell className='px-6'>
        <Skeleton className='h-4 w-36 rounded-full' />
      </TableCell>
      <TableCell className='px-6'>
        <Skeleton className='h-4 w-8 rounded-full' />
      </TableCell>
    </TableRow>
  ));
}

export function StoreTableSkeleton() {
  return (
    <div className='flex flex-col gap-4 rounded-[12px] border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-5 pt-5 pb-1'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-6 w-40 rounded-full' />
        <Skeleton className='h-7 w-20 rounded-full' />
      </div>
      <div className='overflow-clip rounded-[8px] border border-[var(--neutral-300)]'>
        <Table>
          <TableHeader>
            <TableRow className='bg-[#f7f9fb] hover:bg-[#f7f9fb]'>
              {COLUMN_HEADERS.map(({ label, className }) => (
                <TableHead
                  key={label}
                  scope='col'
                  className={`h-[42px] px-6 text-[12px] font-medium uppercase tracking-[-0.15px] text-[#5a6570] ${className}`}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <StoreTableSkeletonRows count={DEFAULT_SKELETON_ROWS} />
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function StoreTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <StoreTableSkeletonRows count={Math.max(rowCount, 1)} />;
}
