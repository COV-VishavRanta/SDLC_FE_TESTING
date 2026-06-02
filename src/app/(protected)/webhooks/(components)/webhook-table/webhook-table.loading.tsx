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
  { label: 'NAME', width: '180px' },
  { label: 'STATUS', width: '100px' },
  { label: 'CREATED AT', width: '150px' },
  { label: 'TOKEN EXPIRATION', width: '150px' },
  { label: "ALLOWED IP'S", width: '200px' },
  { label: 'ACTIONS', width: '100px' },
];

const SKELETON_WIDTHS = ['w-28', 'w-16', 'w-24', 'w-20', 'w-32', 'w-10'];

/* ── Reusable skeleton rows ── */
function WebhookTableSkeletonRows({ count }: { count: number }) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[75px] border-b border-border last:border-b-0'
    >
      {COLUMN_HEADERS.map((col, colIdx) => (
        <TableCell key={`skeleton-cell-${colIdx}`}>
          <Skeleton className={`${SKELETON_WIDTHS[colIdx] ?? 'w-20'} h-6 rounded-full`} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/**
 * Standalone loading skeleton used as a Suspense fallback for the entire table card.
 */
export function WebhookTableSkeleton() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {COLUMN_HEADERS.map(({ label, width }) => (
                <TableHead
                  key={label}
                  scope='col'
                  style={{ width }}
                  className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <WebhookTableSkeletonRows count={DEFAULT_SKELETON_ROWS} />
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
export function WebhookTableInlineLoading({ rowCount }: { rowCount: number }) {
  const count = Math.max(rowCount, 1);
  return <WebhookTableSkeletonRows count={count} />;
}
