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
  { label: 'TEMPLATE NAME', maxWidth: '160px' },
  { label: 'SURVEY COUNT', maxWidth: '200px' },
  { label: 'CREATED DATE', maxWidth: '200px' },
  { label: 'ACTIONS', maxWidth: '180px' },
];

function TemplateTableSkeletonRows({ count }: { count: number }) {
  return Array.from({ length: count }).map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[60px] border-b border-border last:border-b-0'
    >
      <TableCell>
        <Skeleton className='h-5 w-48 rounded-full' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-24 rounded-full' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-5 w-32 rounded-full' />
      </TableCell>
      <TableCell>
        <div className='flex justify-end gap-2'>
          <Skeleton className='size-9 rounded-lg' />
          <Skeleton className='size-9 rounded-lg' />
          <Skeleton className='size-9 rounded-lg' />
        </div>
      </TableCell>
    </TableRow>
  ));
}

export function TemplateTableInlineLoading({ rowCount }: { rowCount: number }) {
  return <TemplateTableSkeletonRows count={rowCount} />;
}

export function TemplateTableSkeleton() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <Table>
        <TableHeader>
          <TableRow className='bg-[var(--neutral-200)] hover:bg-[var(--neutral-200)]'>
            {COLUMN_HEADERS.map((col) => (
              <TableHead
                key={col.label}
                style={{ maxWidth: col.maxWidth }}
                className='text-xs font-medium uppercase tracking-wide text-[var(--neutral-600)]'
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TemplateTableSkeletonRows count={DEFAULT_SKELETON_ROWS} />
        </TableBody>
      </Table>
    </Card>
  );
}
