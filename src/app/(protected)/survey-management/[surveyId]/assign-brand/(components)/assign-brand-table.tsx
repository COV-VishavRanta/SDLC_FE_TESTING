'use no memo';
'use client';

import {
  Button,
  DataTableBody,
  Input,
  SearchIcon,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from '@/components';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE_INDEX, ProtectedRoute } from '@/constant';
import {
  ASSIGN_SURVEY_TO_BRANDS,
  AssignSurveyBrandsInput,
  GET_SURVEY_UNASSIGNED_BRANDS,
  SurveyUnassignedBrandsPayload,
  SurveyUnassignedBrandsVars,
} from '@/graphql';
import { getAriaSort } from '@/lib/utils';
import { SurveyType } from '@/types';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import {
  PaginationState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { AssignBrandTableInlineLoading } from './assign-brand-table.loading';
import { getBrandColumns } from './assign-brands-columns';

/* ── Types ── */
interface AssignSurveyBrandsResponse {
  assignSurveyToBrands: {
    success: boolean;
    message: string;
    survey?: SurveyType;
  };
}

interface AssignSurveyBrandsVariables {
  input: AssignSurveyBrandsInput;
}

interface AssignBrandTableProps {
  surveyId: string;
}

/* ── Main Component ── */
export function AssignBrandTable({ surveyId }: AssignBrandTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('assignBrand');

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');

  /* ── Query ── */
  const { data } = useSuspenseQuery<SurveyUnassignedBrandsPayload, SurveyUnassignedBrandsVars>(
    GET_SURVEY_UNASSIGNED_BRANDS,
    {
      variables: {
        surveyId,
      },
      fetchPolicy: 'network-only',
    },
  );

  /* ── Mutation ── */
  const [assignSurveyToBrands, { loading: isSaving }] = useMutation<
    AssignSurveyBrandsResponse,
    AssignSurveyBrandsVariables
  >(ASSIGN_SURVEY_TO_BRANDS);

  /* ── Derived data ── */
  const brands = data?.surveyUnassignedBrands?.brands ?? [];

  /* ── Table — client-side pagination, sorting & filtering ── */
  const columns = getBrandColumns(t);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: brands,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    autoResetPageIndex: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      startTransition(() => {
        setPagination(typeof updater === 'function' ? updater(pagination) : updater);
      });
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { pagination, rowSelection, sorting, globalFilter },
  });

  /* ── Derived counts (based on filtered rows) ── */
  const totalCount = table.getFilteredRowModel().rows.length;
  const startRow = totalCount > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
  const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount);

  /* ── Handlers ── */
  const handleSave = async () => {
    const brandIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    if (brandIds.length === 0) return;

    await assignSurveyToBrands({
      variables: { input: { surveyId, brandIds } },
      onCompleted: () => {
        toast.success(t('successMessage'));
        router.push(`${ProtectedRoute.SURVEY_MANAGEMENT}?tab=surveys`);
      },
    });
  };

  // calculate number of rows to show while loading
  // use pageSize unless we are on the last page and know the total count
  const rowsOnPage =
    totalCount > 0 && Math.ceil(totalCount / pagination.pageSize) === pagination.pageIndex + 1
      ? endRow - startRow + 1
      : pagination.pageSize;

  const isSaveDisabled =
    Object.keys(rowSelection).filter((id) => rowSelection[id]).length === 0 ||
    isSaving ||
    isPending;

  return (
    <>
    
      {/* Search */}
      <div className=' w-full flex justify-end'>
        <div className='w-4/12 relative'> 
        <SearchIcon className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder={t('searchPlaceholder')}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='pl-9 bg-white'
          aria-label={t('searchAriaLabel')}
        />
        </div>
      </div>

      {/* Table card */}
      <div
        role='region'
        aria-label={t('tableAriaLabel')}
        className='overflow-clip rounded-xl border border-border'
      >
        <Table aria-busy={isPending}>
          <TableCaption>{t('tableCaption')}</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={getAriaSort(header)}
                    className={header.id === 'select' ? 'w-12' : ''}
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
            loadingContent={<AssignBrandTableInlineLoading rowCount={rowsOnPage} />}
            table={table}
            isLoading={isPending}
            emptyMessage={t('emptyMessage')}
          />
        </Table>

        {/* Pagination */}
        <TableFooter className='flex items-center justify-between px-4 py-3'>
          <TablePagination
            table={table}
            totalCount={totalCount}
            startRow={startRow}
            endRow={endRow}
            entityLabel={t('paginationLabel')}
          />
        </TableFooter>
      </div>

      {/* Actions */}
      <div className='flex justify-end gap-3'>
        <Button
          variant='outline'
          onClick={() => router.back()}
          disabled={isSaving}
          aria-label={t('cancelButton')}
        >
          {t('cancelButton')}
        </Button>
        <Button onClick={handleSave} disabled={isSaveDisabled} aria-label={t('saveButton')}>
          {isSaving ? t('savingButton') : t('saveButton')}
        </Button>
      </div>
    </>
  );
}
