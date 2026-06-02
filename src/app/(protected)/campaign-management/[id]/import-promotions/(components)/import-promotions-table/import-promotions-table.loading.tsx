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
  { label: 'SELECT', maxWidth: '40px' },
  { label: 'PROMOTION NAME', maxWidth: '220px' },
  { label: 'HEIGHT', maxWidth: '80px' },
  { label: 'WIDTH', maxWidth: '80px' },
  { label: 'MATERIAL', maxWidth: '140px' },
  { label: 'NEED DESIGN', maxWidth: '100px' },
  { label: 'PHOTO', maxWidth: '80px' },
  { label: 'ACTIONS', maxWidth: '80px' },
];

function SkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[56px] border-b border-border last:border-b-0'
    >
      {COLUMN_HEADERS.map(({ label }, colIdx) => {
        let skeletonClass = 'h-5 w-20 rounded-full';
        if (label === 'SELECT') skeletonClass = 'h-4 w-4 rounded';
        else if (label === 'PROMOTION NAME') skeletonClass = 'h-5 w-40 rounded-full';
        else if (label === 'MATERIAL') skeletonClass = 'h-5 w-24 rounded-full';
        else if (label === 'PHOTO' || label === 'ACTIONS') skeletonClass = 'h-5 w-12 rounded-full';
        return (
          <TableCell key={`skeleton-cell-${colIdx}`}>
            <Skeleton className={skeletonClass} />
          </TableCell>
        );
      })}
    </TableRow>
  ));
}

export function ImportPromotionsTableSkeleton() {
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
    </Card>
  );
}

export function ImportPromotionsTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <SkeletonRows count={Math.max(rowCount, 1)} />;
}
