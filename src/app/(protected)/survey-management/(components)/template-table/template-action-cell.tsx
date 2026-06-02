'use client';

import { ActionButtonCell, ActionCellContainer, EditIcon, EyeIcon, TrashIcon } from '@/components';
import { SurveyTemplateType } from '@/types';
import { useTranslations } from 'next-intl';

import { ProtectedRoute } from '@/constant';
import { encodeId } from '@/lib';
import { Row } from '@tanstack/react-table';

interface TemplateActionCellProps {
  onDelete: (template: SurveyTemplateType) => void;
  row: Row<SurveyTemplateType>;
}

export default function TemplateActionCell({ onDelete, row }: TemplateActionCellProps) {
  const t = useTranslations('surveyManagement');
  const id = encodeId(row.original.id);

  return (
    <ActionCellContainer className='justify-end'>
      <ActionButtonCell
        icon={<EyeIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
        tooltip={t('template.actions.view')}
        href={`${ProtectedRoute.SURVEY_TEMPLATE}/${id}/preview`}
        className='hover:bg-[var(--primary-300)]'
      />
      <ActionButtonCell
        icon={<EditIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
        tooltip={t('template.actions.edit')}
        href={`${ProtectedRoute.SURVEY_TEMPLATE}/${id}/edit`}
        className='hover:bg-[var(--primary-300)]'
      />
      <ActionButtonCell
        icon={<TrashIcon className='size-[18px] text-destructive' aria-hidden='true' />}
        tooltip={t('template.actions.delete')}
        onClick={() => {
          onDelete(row.original);
        }}
        className='hover:bg-red-50'
      />
    </ActionCellContainer>
  );
}
