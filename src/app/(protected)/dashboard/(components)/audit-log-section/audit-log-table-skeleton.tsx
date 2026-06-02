import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';

const ROW_COUNT = 10;

const COLUMN_HEADERS = [
  { label: 'USER', width: '268px' },
  { label: 'ROLE', width: '194px' },
  { label: 'ACTION', width: '258px' },
  { label: 'TIMESTAMP', width: '213px' },
  { label: 'SYSTEM AREA', width: '160px' },
];

const SKELETON_WIDTHS = [140, 100, 180, 130, 110];

const MOBILE_CARD_COUNT = 5;

/* ─── Mobile Card Skeleton ─── */
function AuditLogMobileCardSkeleton() {
  return (
    <div className='flex w-full flex-col gap-2 rounded-[10px] border border-[var(--neutral-200)] bg-[var(--neutral-100)] p-3 shadow-sm'>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-5 w-40' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
      <Skeleton className='h-5 w-48' />
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-6 w-28 rounded-full' />
      </div>
    </div>
  );
}

export function AuditLogTableSkeleton() {
  return (
    <Card className='overflow-clip rounded-xl border border-border p-0' aria-hidden='true'>
      <CardHeader className='flex flex-row items-start justify-between border-b border-[var(--neutral-300)] px-6 py-5 sm:items-center'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-5 w-20' />
      </CardHeader>

      {/* Desktop table skeleton */}
      <CardContent className='hidden p-0 px-6 pb-6 pt-6 sm:block'>
        <div className='overflow-hidden rounded-lg border border-border'>
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMN_HEADERS.map(({ label, width }) => (
                  <TableHead
                    key={label}
                    scope='col'
                    style={{ width }}
                    className='h-[44px] text-xs font-medium uppercase tracking-wider text-text-secondary'
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: ROW_COUNT }).map((_, rowIdx) => (
                <TableRow
                  key={`skeleton-row-${rowIdx}`}
                  className='h-[44px] border-b border-border last:border-b-0'
                >
                  {SKELETON_WIDTHS.map((w, colIdx) => (
                    <TableCell key={`skeleton-cell-${colIdx}`}>
                      <Skeleton className='h-4 rounded-full' style={{ width: w }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Mobile card skeleton */}
      <CardContent className='flex flex-col gap-2.5 p-3 sm:hidden'>
        {Array.from({ length: MOBILE_CARD_COUNT }).map((_, i) => (
          <AuditLogMobileCardSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}
