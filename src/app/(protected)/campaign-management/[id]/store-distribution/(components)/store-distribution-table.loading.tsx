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
  { label: 'STORE NAME', minWidth: '280px' },
  { label: 'QTY', minWidth: '120px' },
];

function StoreDistributionSkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[65px] border-b border-border last:border-b-0'
    >
      <TableCell>
        <Skeleton className='h-5 w-48 rounded-full' />
      </TableCell>
      <TableCell className='text-right'>
        <Skeleton className='ml-auto h-9 w-[100px] rounded-lg' />
      </TableCell>
    </TableRow>
  ));
}

/**
 * Full-card skeleton — used as the Suspense fallback for the page.
 */
export function StoreDistributionTableSkeleton() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0 shadow-none'>
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMN_HEADERS.map(({ label, minWidth }) => (
              <TableHead key={label} scope='col' style={{ minWidth }}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <StoreDistributionSkeletonRows count={DEFAULT_SKELETON_ROWS} />
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * Inline skeleton rows rendered inside an existing `<TableBody>` when
 * data is loading (e.g., during save or async transitions).
 */
export function StoreDistributionTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <StoreDistributionSkeletonRows count={Math.max(rowCount, 1)} />;
}
