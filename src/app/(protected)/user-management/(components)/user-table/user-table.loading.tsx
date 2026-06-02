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

import { columns } from './user-table-columns';

const DEFAULT_SKELETON_ROWS = 5;

const COLUMN_HEADERS = [
  { label: 'USER', maxWidth: '190px' },
  { label: 'EMAIL', maxWidth: '220px' },
  { label: 'USER ROLES', maxWidth: '150px' },
  { label: 'STATUS', maxWidth: '105px' },
  { label: 'CREATED', maxWidth: '115px' },
  { label: 'ACTIONS', maxWidth: '260px' },
];

/* ── Reusable skeleton rows ── */
function SkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[75px] border-b border-border last:border-b-0'
    >
      {columns.map((col, colIdx) => {
        const key = 'accessorKey' in col && col.accessorKey ? col.accessorKey : col.id;
        let skeletonClass = 'w-20 h-6 rounded-full';
        switch (key) {
          case 'name':
            skeletonClass = 'w-32 h-6 rounded-full';
            break;
          case 'email':
            skeletonClass = 'w-40 h-6 rounded-full';
            break;
          case 'roles':
            skeletonClass = 'w-24 h-6 rounded-full';
            break;
          case 'status':
            skeletonClass = 'w-16 h-6 rounded-full';
            break;
          case 'createdAt':
            skeletonClass = 'w-24 h-6 rounded-full';
            break;
          case 'actions':
            skeletonClass = 'w-32 h-6 rounded-full';
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
 * Standalone loading skeleton used as a Suspense fallback for the entire table card.
 */
export default function UserTableLoading() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {COLUMN_HEADERS.map(({ label, maxWidth }) => (
                // scope="col" associates header with its column (WCAG 1.3.1)
                <TableHead
                  key={label}
                  scope='col'
                  style={{ maxWidth }}
                  className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                >
                  {label}
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
  );
}

/**
 * Inline skeleton rows rendered inside an existing `<TableBody>` when
 * new data is being fetched (e.g., on page change).
 */
export function UserTableInlineLoading({ rowCount }: { rowCount: number }) {
  const count = Math.max(rowCount, 1);
  return <SkeletonRows count={count} />;
}
