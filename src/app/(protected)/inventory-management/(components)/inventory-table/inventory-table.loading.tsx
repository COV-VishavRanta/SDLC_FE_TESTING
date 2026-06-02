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

import { inventoryColumns } from './inventory-table-columns';

const DEFAULT_SKELETON_ROWS = 5;

const COLUMN_HEADERS = [
  { label: 'ITEM NAME', maxWidth: '220px' },
  { label: 'BRAND', maxWidth: '220px' },
  { label: 'AVAILABLE QTY', maxWidth: '160px' },
  { label: 'ACTIONS', maxWidth: '140px' },
];

/* ── Reusable skeleton rows ── */
function InventoryTableSkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[64px] border-b border-border last:border-b-0'
    >
      {inventoryColumns.map((col, colIdx) => {
        const key = 'accessorKey' in col && col.accessorKey ? col.accessorKey : col.id;
        let skeletonClass = 'w-20 h-6 rounded-full';
        switch (key) {
          case 'name':
            skeletonClass = 'w-36 h-6 rounded-full';
            break;
          case 'brandId':
            skeletonClass = 'w-28 h-6 rounded-full';
            break;
          case 'quantity':
            skeletonClass = 'w-16 h-6 rounded-full';
            break;
          case 'actions':
            skeletonClass = 'w-24 h-6 rounded-full';
            break;
          default:
            break;
        }
        return (
          <TableCell key={`skeleton-cell-${colIdx}`}>
            <Skeleton className={skeletonClass} />
          </TableCell>
        );
      })}
    </TableRow>
  ));
}

/**
 * Standalone loading skeleton used as a Suspense fallback for the table card.
 */
export function InventoryTableSkeleton() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {COLUMN_HEADERS.map(({ label, maxWidth }) => (
                <TableHead
                  key={label}
                  scope='col'
                  style={{ maxWidth }}
                  className='py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary'
                >
                  <Skeleton className='h-4 w-20 rounded-full' />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <InventoryTableSkeletonRows count={DEFAULT_SKELETON_ROWS} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/**
 * Inline loading overlay — renders skeleton rows inside the live table.
 */
export function InventoryTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <InventoryTableSkeletonRows count={rowCount} />;
}
