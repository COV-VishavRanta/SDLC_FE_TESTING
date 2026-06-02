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
const DEFAULT_SKELETON_COLS = 8;

function ReportTableSkeletonRows({ rowCount, colCount }: { rowCount: number; colCount: number }) {
  return Array.from({ length: rowCount }).map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[64px] border-b border-border last:border-b-0'
    >
      {Array.from({ length: colCount }).map((__, colIdx) => (
        <TableCell key={`skeleton-cell-${colIdx}`}>
          <Skeleton className='h-5 w-24 rounded-full' />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function ReportTableSkeleton({
  columnCount = DEFAULT_SKELETON_COLS,
}: {
  columnCount?: number;
}) {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {Array.from({ length: columnCount }).map((_, idx) => (
                <TableHead
                  key={`skeleton-head-${idx}`}
                  scope='col'
                  className='py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary'
                >
                  <Skeleton className='h-4 w-20 rounded-full' />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <ReportTableSkeletonRows rowCount={DEFAULT_SKELETON_ROWS} colCount={columnCount} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export function ReportTableInlineLoading({
  rowCount,
  colCount,
}: {
  rowCount: number;
  colCount: number;
}) {
  return <ReportTableSkeletonRows rowCount={rowCount} colCount={colCount} />;
}
