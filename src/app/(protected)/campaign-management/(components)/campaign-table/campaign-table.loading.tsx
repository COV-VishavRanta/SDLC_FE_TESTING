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
  CAMPAIGN_CAPABILITIES_MAP,
  DEFAULT_CAMPAIGN_CAPABILITIES,
} from '@/lib/permissions/route.permissions';
import { useTranslations } from 'next-intl';

import { getCampaignColumns } from './campaign-table-columns';

const DEFAULT_SKELETON_ROWS = 5;

const SKELETON_COLUMN_STYLES: Record<string, { label: string; minWidth: string }> = {
  name: { label: 'CAMPAIGN NAME', minWidth: '240px' },
  brandName: { label: 'BRAND', minWidth: '160px' },
  totalQuantity: { label: 'QTY', minWidth: '80px' },
  type: { label: 'TYPE', minWidth: '120px' },
  status: { label: 'STATUS', minWidth: '150px' },
  storeCount: { label: 'STORES', minWidth: '80px' },
  promotions: { label: 'PROMOTIONS', minWidth: '80px' },
  createdAt: { label: 'CREATED', minWidth: '120px' },
  shipByDate: { label: 'EXPECTED SHIP BY DATE', minWidth: '120px' },
  actions: { label: 'ACTIONS', minWidth: '120px' },
};

/* ── Reusable skeleton rows ── */
function SkeletonRows({
  count,
  columns,
}: {
  count: number;
  columns: ReturnType<typeof getCampaignColumns>;
}) {
  const rows = Array.from({ length: count });
  return rows.map((_, rowIdx) => (
    <TableRow
      key={`skeleton-row-${rowIdx}`}
      className='h-[77px] border-b border-border last:border-b-0'
    >
      {columns.map((col, colIdx) => {
        const key = 'accessorKey' in col && col.accessorKey ? col.accessorKey : col.id;
        const colKey = key as string;
        let skeletonContent: React.ReactNode;

        switch (colKey) {
          case 'name':
            skeletonContent = (
              <div className='flex flex-col gap-1.5'>
                <Skeleton className='h-4 w-40 rounded-full' />
                <Skeleton className='h-3 w-28 rounded-full' />
              </div>
            );
            break;
          case 'brandName':
            skeletonContent = <Skeleton className='h-4 w-28 rounded-full' />;
            break;
          case 'totalQuantity':
            skeletonContent = <Skeleton className='h-4 w-10 rounded-full' />;
            break;
          case 'type':
            skeletonContent = <Skeleton className='h-4 w-20 rounded-full' />;
            break;
          case 'status':
            skeletonContent = <Skeleton className='h-6 w-28 rounded-full' />;
            break;
          case 'storeCount':
            skeletonContent = <Skeleton className='h-4 w-10 rounded-full' />;
            break;
          case 'promotions':
            skeletonContent = <Skeleton className='h-4 w-10 rounded-full' />;
            break;
          case 'createdAt':
            skeletonContent = <Skeleton className='h-4 w-24 rounded-full' />;
            break;
          case 'shipByDate':
            skeletonContent = <Skeleton className='h-4 w-24 rounded-full' />;
            break;
          case 'actions':
            skeletonContent = (
              <div className='flex justify-center gap-1'>
                <Skeleton className='size-9 rounded-lg' />
                <Skeleton className='size-9 rounded-lg' />
              </div>
            );
            break;
          default:
            skeletonContent = <Skeleton className='h-4 w-20 rounded-full' />;
        }

        return (
          <TableCell key={`${rowIdx}-${colIdx}`} className='px-5'>
            {skeletonContent}
          </TableCell>
        );
      })}
    </TableRow>
  ));
}

export function CampaignTableSkeleton() {
  const t = useTranslations('campaignManagement');
  const capabilities = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);
  const columns = getCampaignColumns(t, capabilities);

  return (
    <Card className='overflow-clip rounded-xl border border-border p-0'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-b border-border bg-input-bg hover:bg-input-bg'>
              {columns.map((col) => {
                const key = 'accessorKey' in col && col.accessorKey ? col.accessorKey : col.id;
                const colKey = key as string;
                const style = SKELETON_COLUMN_STYLES[colKey] || {
                  label: colKey,
                  minWidth: '100px',
                };

                return (
                  <TableHead
                    key={colKey}
                    scope='col'
                    className='h-[50px] px-5 text-xs font-medium uppercase tracking-wider text-text-secondary'
                    style={{ minWidth: style.minWidth }}
                  >
                    {style.label}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRows count={DEFAULT_SKELETON_ROWS} columns={columns} />
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

/* ── Inline loading (used while transitioning between pages) ── */
export function CampaignTableInlineLoading({ rowCount }: { rowCount: number }) {
  const t = useTranslations('campaignManagement');
  const capabilities = useCapabilities(CAMPAIGN_CAPABILITIES_MAP, DEFAULT_CAMPAIGN_CAPABILITIES);
  const columns = getCampaignColumns(t, capabilities);

  return <SkeletonRows count={rowCount || DEFAULT_SKELETON_ROWS} columns={columns} />;
}
