'use client';
'use no memo';

import { NoRecordFound, TablePagination } from '@/components';
import ViewImagesDialog from '@/components/dialog/view-images-dialog/view-images-dialog';
import { Card } from '@/components/ui/card';
import {
  DataTableBody,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReportKey, SortOrder } from '@/constant';
import { getAriaSort } from '@/lib/utils';
import { PaginationInfo } from '@/types';
import { skipToken, useSuspenseQuery } from '@apollo/client/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useContext, useEffect, useMemo, useState } from 'react';

import { ReportConfig } from '../../config/report-registry';
import { ReportsContext } from '../../context/ReportsContext';
import { ReportTableInlineLoading } from './ReportTable.loading';
import { CAMPAIGN_SUMMARY_COLUMN_STYLE } from './columns/campaign-summary.columns';
import { EXCEPTION_QUEUE_COLUMN_STYLE } from './columns/exception-queue.columns';
import {
  EXCEPTION_PROOF_COLUMN_STYLE,
  getExecutionProofColumns,
} from './columns/execution-proof.columns';
import { ISSUE_REORDER_COLUMN_STYLE } from './columns/issues-reorders.columns';
import { OPS_DASHBOARD_COLUMN_STYLE } from './columns/ops-dashboard.columns';
import { getProofReviewColumns, PROOF_REVIEW_COLUMN_STYLE } from './columns/proof-review.columns';
import { SHIPMENT_TRACKING_COLUMN_STYLE } from './columns/shipments-tracking.columns';
import { STORE_ORDERS_COLUMN_STYLE } from './columns/store-orders.columns';
import { SURVEY_RESPONSE_COLUMN_STYLE } from './columns/survey-response.columns';

interface ReportTableProps {
  config: ReportConfig;
}

export function ReportTable({ config }: ReportTableProps) {
  const t = useTranslations('reports');
  const { sorting, setSorting, pagination, setPagination, isPending, entityId, setTotalCount } =
    useContext(ReportsContext);

  const [viewProofImages, setViewProofImages] = useState<string[] | null>(null);

  /* ── Derive GraphQL variables from context state + config ── */
  const variables = useMemo(() => {
    const sortFieldId = sorting[0]?.id;
    const sortField = sortFieldId ? config?.sortFieldMap[sortFieldId] : undefined;

    const base: Record<string, unknown> = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sortField
        ? {
            sort: {
              field: sortField,
              order: sorting[0]?.desc ? SortOrder.DESC : SortOrder.ASC,
            },
          }
        : {}),
    };

    if (config?.entityType === 'psp') {
      if (!entityId) return null;
      return { ...base, pspId: entityId };
    }
    if (config?.entityType === 'brand') {
      if (!entityId) return null;
      return { ...base, brandId: entityId };
    }
    return base;
  }, [config, sorting, pagination, entityId]);

  /* ── Fetch data — skipToken when no config/entity; fallback query satisfies Apollo's DocumentNode requirement ── */
  const { data: tableData } = useSuspenseQuery(
    config.fetchQuery,
    variables ? { variables, fetchPolicy: 'network-only' } : skipToken,
  );

  /* ── Extract items and pagination from response using dataPath ── */
  const payload = (
    tableData as Record<string, { items: unknown[]; pagination: PaginationInfo } | undefined>
  )?.[config.dataPath];
  const items = payload?.items ?? [];
  const paginationInfo = payload?.pagination;

  /* ── Sync total count into context so export buttons can react ── */
  const resolvedTotalCount = paginationInfo?.totalCount ?? 0;
  useEffect(() => {
    setTotalCount(resolvedTotalCount);
  }, [resolvedTotalCount, setTotalCount]);

  /* ── Show entity-missing message ── */
  const showEntityMissing = !variables && config.entityType !== 'none';
  const entityLabel = config.entityType === 'psp' ? 'PSP' : 'Brand';

  const columns = useMemo(() => {
    if (config.key === ReportKey.EXECUTION_PROOF) {
      return getExecutionProofColumns({ onViewImages: setViewProofImages });
    }
    if (config.key === ReportKey.PROOF_REVIEW) {
      return getProofReviewColumns({ onViewImages: setViewProofImages });
    }
    return config.getColumns();
  }, [config]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: showEntityMissing ? [] : items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 0,
    rowCount: paginationInfo?.totalCount,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  if (showEntityMissing) {
    return (
      <Card className='flex items-center justify-center rounded-xl border border-border p-6'>
        <NoRecordFound message={t('table.noEntitySelected', { entity: entityLabel })} />
      </Card>
    );
  }

  const totalCount = paginationInfo?.totalCount ?? 0;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);
  const rowsOnPage =
    totalCount > 0 && Math.ceil(totalCount / pagination.pageSize) === pagination.pageIndex + 1
      ? endRow - startRow + 1
      : pagination.pageSize;

  return (
    <>
      <Card className='overflow-clip rounded-xl border border-border p-0'>
        <div aria-live='polite' aria-atomic='true' className='sr-only'>
          {isPending ? t('table.loadingState') : ''}
        </div>

        <Table aria-busy={isPending}>
          <TableCaption>{t('table.caption')}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={getAriaSort(header)}
                    style={{
                      ...CAMPAIGN_SUMMARY_COLUMN_STYLE[header.id],
                      ...EXCEPTION_QUEUE_COLUMN_STYLE[header.id],
                      ...EXCEPTION_PROOF_COLUMN_STYLE[header.id],
                      ...ISSUE_REORDER_COLUMN_STYLE[header.id],
                      ...OPS_DASHBOARD_COLUMN_STYLE[header.id],
                      ...PROOF_REVIEW_COLUMN_STYLE[header.id],
                      ...SHIPMENT_TRACKING_COLUMN_STYLE[header.id],
                      ...STORE_ORDERS_COLUMN_STYLE[header.id],
                      ...SURVEY_RESPONSE_COLUMN_STYLE[header.id],
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <DataTableBody
            table={table}
            isLoading={isPending}
            emptyMessage={t('table.emptyState')}
            loadingContent={
              <ReportTableInlineLoading rowCount={rowsOnPage} colCount={columns.length} />
            }
          />
        </Table>

        <TableFooter role='navigation' aria-label='Table pagination'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('table.paginationLabel')}
          />
        </TableFooter>
      </Card>

      {viewProofImages && (
        <ViewImagesDialog
          open={!!viewProofImages}
          onClose={() => setViewProofImages(null)}
          title='Proof Images'
          imageUrls={viewProofImages}
        />
      )}
    </>
  );
}
