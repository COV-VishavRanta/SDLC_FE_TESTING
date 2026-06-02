'use client';

import { CreatedDateCell, SortableHeader } from '@/components';
import { SurveyTemplateType } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import TemplateActionCell from './template-action-cell';

type TranslateFn = ReturnType<typeof useTranslations<'surveyManagement'>>;

interface GetTemplateColumnsArgs {
  t: TranslateFn;
  onDelete: (template: SurveyTemplateType) => void;
}

export function getTemplateColumns({
  t,
  onDelete,
}: GetTemplateColumnsArgs): ColumnDef<SurveyTemplateType>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('template.table.columns.templateName')}</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'surveyCount',
      header: () => (
        <span className='block uppercase'>{t('template.table.columns.surveyCount')}</span>
      ),
      cell: ({ row }) => (
        <span className='text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[var(--neutral-700)]'>
          {row.original.surveyCount ?? '-'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <SortableHeader column={column}>{t('template.table.columns.createdDate')}</SortableHeader>
      ),
      cell: ({ row }) => <CreatedDateCell value={row.getValue<string | Date>('createdAt')} />,
    },
    {
      id: 'actions',
      header: () => (
        <span className='block text-right uppercase'>{t('template.table.columns.actions')}</span>
      ),
      cell: ({ row }) => <TemplateActionCell onDelete={onDelete} row={row} />,
      enableSorting: false,
    },
  ];
}

/**
 * Static column definitions (used by TemplateTableSkeleton for skeleton column count).
 * Column headers here are intentionally untranslated placeholders.
 */
export const templateColumns: ColumnDef<SurveyTemplateType>[] = [
  { accessorKey: 'name', header: 'Template Name' },
  { accessorKey: 'createdAt', header: 'Created Date' },
  { id: 'actions', header: 'Actions' },
];
