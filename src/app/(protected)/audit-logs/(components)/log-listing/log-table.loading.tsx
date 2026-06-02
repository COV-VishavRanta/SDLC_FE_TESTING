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

import { auditLogColumns } from './log-table-columns';

const DEFAULT_SKELETON_ROWS = 5;

const COLUMN_HEADERS = [
  { label: 'USER', maxWidth: '200px' },
  { label: 'ROLE', maxWidth: '140px' },
  { label: 'ACTION', maxWidth: '200px' },
  { label: 'TIMESTAMP', maxWidth: '140px' },
  { label: 'SYSTEM AREA', maxWidth: '150px' },
  // Empty visible label for action-icon column — sr-only text ensures AT is not left with a blank header (WCAG 1.3.1)
  { label: '', srOnly: 'Details', maxWidth: '60px' },
];

function SkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[75px] border-b border-border last:border-b-0'
    >
      {auditLogColumns.map((col, colIdx) => {
        const key = 'accessorKey' in col && col.accessorKey ? String(col.accessorKey) : col.id;
        let skeletonClass = 'w-20 h-5 rounded-full';
        switch (key) {
          case 'actorUserId':
            skeletonClass = 'w-40 h-5 rounded-full';
            break;
          case 'role':
            skeletonClass = 'w-24 h-6 rounded-full';
            break;
          case 'action':
            skeletonClass = 'w-36 h-5 rounded-full';
            break;
          case 'createdAt':
            skeletonClass = 'w-28 h-5 rounded-full';
            break;
          case 'entityType':
            skeletonClass = 'w-28 h-6 rounded-full';
            break;
          case 'details':
            skeletonClass = 'w-8 h-8 rounded-lg';
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
 * Standalone loading skeleton — used as a Suspense fallback for the full table card.
 */
export default function LogTableLoading() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMN_HEADERS.map(({ label, srOnly, maxWidth }) => (
                // scope="col" associates header with its column (WCAG 1.3.1)
                <TableHead key={label || 'details'} scope='col' style={{ maxWidth }}>
                  {label}
                  {/* sr-only label for empty-visible-text columns (WCAG 1.3.1) */}
                  {srOnly && <span className='sr-only'>{srOnly}</span>}
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
 * Inline loading overlay — shows skeleton rows inside an already-mounted table.
 */
export function LogTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <SkeletonRows count={rowCount} />;
}
