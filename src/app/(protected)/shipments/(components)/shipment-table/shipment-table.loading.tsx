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
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_SHIPMENT_CAPABILITIES,
  SHIPMENT_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/shipment.capabilities';

const DEFAULT_SKELETON_ROWS = 5;
const STORE_COLUMN_INDEX = 3;

const COLUMN_HEADERS = [
  { label: 'SHIPMENT NO', width: '136px' },
  { label: 'CAMPAIGN', width: '195px' },
  { label: 'ORDER NUMBER', width: '196px' },
  { label: 'STORE', width: '194px' },
  { label: 'ETA', width: '156px' },
  { label: 'TRACKING NUMBER', width: '194px' },
  { label: 'STATUS', width: '90px' },
];

const SKELETON_WIDTHS = ['w-24', 'w-36', 'w-20', 'w-32', 'w-24', 'w-36', 'w-16'];

/* ── Reusable skeleton rows ── */
function ShipmentTableSkeletonRows({
  count,
  showStoreColumn,
}: {
  count: number;
  showStoreColumn: boolean;
}) {
  const widths = showStoreColumn
    ? SKELETON_WIDTHS
    : SKELETON_WIDTHS.filter((_, i) => i !== STORE_COLUMN_INDEX);
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[75px] border-b border-border last:border-b-0'
    >
      {widths.map((width, colIdx) => (
        <TableCell key={`skeleton-cell-${colIdx}`}>
          <Skeleton className={`${width} h-6 rounded-full`} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/**
 * Standalone loading skeleton used as a Suspense fallback for the entire table card.
 */
export function ShipmentTableSkeleton() {
  const { showStoreColumn } = useCapabilities(
    SHIPMENT_CAPABILITIES_MAP,
    DEFAULT_SHIPMENT_CAPABILITIES,
  );
  const headers = showStoreColumn
    ? COLUMN_HEADERS
    : COLUMN_HEADERS.filter((_, i) => i !== STORE_COLUMN_INDEX);

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {headers.map(({ label, width }) => (
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
            <ShipmentTableSkeletonRows
              count={DEFAULT_SKELETON_ROWS}
              showStoreColumn={showStoreColumn}
            />
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
export function ShipmentTableInlineLoading({
  rowCount,
  showStoreColumn,
}: {
  rowCount: number;
  showStoreColumn: boolean;
}) {
  const count = Math.max(rowCount, 1);
  return <ShipmentTableSkeletonRows count={count} showStoreColumn={showStoreColumn} />;
}
