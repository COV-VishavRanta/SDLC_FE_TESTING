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
  { label: 'SURVEY NAME', minWidth: '320px' },
  { label: 'RESPONSE COUNT', minWidth: '160px' },
  { label: 'BRAND ASSIGNED', minWidth: '200px' },
  { label: 'STATUS', minWidth: '120px' },
  { label: 'ACTIONS', minWidth: '180px' },
];

const SKELETON_WIDTHS = ['w-40', 'w-10', 'w-28', 'w-16', 'w-28'];

function SurveyTableSkeletonRows({
  count,
  columnCount,
}: {
  count: number;
  columnCount?: number;
}) {
  const widths = columnCount
    ? SKELETON_WIDTHS.slice(0, columnCount)
    : SKELETON_WIDTHS;

  return Array.from({ length: count }).map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[60px] border-b border-border last:border-b-0'
    >
      {widths.map((w, colIdx) => (
        <TableCell key={`skeleton-cell-${colIdx}`}>
          <Skeleton className={`${w} h-5 rounded-full`} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/**
 * Standalone loading skeleton used as a Suspense fallback for the entire table card.
 */
export function SurveyTableSkeleton({ columnCount }: { columnCount?: number } = {}) {
  const headers = columnCount
    ? COLUMN_HEADERS.slice(0, columnCount)
    : COLUMN_HEADERS;

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {headers.map(({ label, minWidth }) => (
                <TableHead
                  key={label}
                  scope='col'
                  style={{ minWidth }}
                  className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <SurveyTableSkeletonRows count={DEFAULT_SKELETON_ROWS} columnCount={columnCount} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/**
 * Inline skeleton rows rendered inside an existing <TableBody> when
 * new data is being fetched (e.g., on page change).
 */
export function SurveyTableInlineLoading({
  rowCount,
  columnCount,
}: {
  rowCount: number;
  columnCount?: number;
}) {
  const count = Math.max(rowCount, 1);
  return <SurveyTableSkeletonRows count={count} columnCount={columnCount} />;
}
