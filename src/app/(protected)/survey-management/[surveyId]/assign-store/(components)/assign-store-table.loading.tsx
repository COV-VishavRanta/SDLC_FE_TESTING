import { Skeleton, TableCell, TableRow } from '@/components';

const SKELETON_ROW_COUNT = 8;

/* ── Reusable skeleton rows (renders inside an existing <TableBody>) ── */
function AssignStoreTableSkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, i) => (
    <TableRow key={`skeleton-row-${i}`} className='h-[75px] border-b border-border last:border-b-0'>
      <TableCell>
        <Skeleton className='size-4 rounded' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-20 rounded-full' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-48 rounded-full' />
      </TableCell>
    </TableRow>
  ));
}

export function AssignStoreTableSkeleton() {
  return (
    <div
      aria-busy='true'
      aria-label='Loading assign store page'
      className='flex flex-col gap-6 p-6'
    >
      {/* Back link */}
      <Skeleton className='h-5 w-44' />

      {/* Page title */}
      <Skeleton className='h-8 w-64' />

      {/* Search bar */}
      <Skeleton className='h-9 w-80' />

      {/* Table card */}
      <div className='overflow-clip rounded-xl border border-border'>
        {/* Table header */}
        <div className='flex items-center gap-4 border-b border-border bg-muted/30 px-4 py-3'>
          <Skeleton className='size-4 rounded' />
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-4 w-32' />
        </div>

        {/* Table rows */}
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0'
          >
            <Skeleton className='size-4 rounded' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-48' />
          </div>
        ))}

        {/* Pagination footer */}
        <div className='flex items-center justify-between px-4 py-3'>
          <Skeleton className='h-4 w-32' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-8 rounded' />
            <Skeleton className='h-8 w-8 rounded' />
            <Skeleton className='h-8 w-8 rounded' />
            <Skeleton className='h-8 w-8 rounded' />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex justify-end gap-3'>
        <Skeleton className='h-9 w-20 rounded-md' />
        <Skeleton className='h-9 w-16 rounded-md' />
      </div>
    </div>
  );
}

/**
 * Inline skeleton rows rendered inside an existing `<TableBody>` when
 * new data is being fetched (e.g., on page change).
 */
export function AssignStoreTableInlineLoading({ rowCount }: { rowCount: number }) {
  const count = Math.max(rowCount, 1);
  return <AssignStoreTableSkeletonRows count={count} />;
}
