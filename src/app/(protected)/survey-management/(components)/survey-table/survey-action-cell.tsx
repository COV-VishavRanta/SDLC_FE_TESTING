'use client';

import {
  ActionButtonCell,
  ActionCellContainer,
  AddResponseIcon,
  AssignToBrandIcon,
  EditIcon,
  EyeIcon,
  StoreIcon,
  TrashIcon,
} from '@/components';
import { ProtectedRoute, SurveyStatusEnum } from '@/constant';
import { useCapabilities } from '@/hooks';
import { DEFAULT_SURVEY_CAPABILITIES, encodeId, SURVEY_CAPABILITIES_MAP } from '@/lib';
import { SurveyListItemType } from '@/types';
import { Row } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

interface SurveyActionCellProps {
  onDelete: (survey: SurveyListItemType) => void;
  onViewResponse: (survey: SurveyListItemType) => void;
  row: Row<SurveyListItemType>;
}

export default function SurveyActionCell({ onDelete, onViewResponse, row }: SurveyActionCellProps) {
  const t = useTranslations('surveyManagement');
  const id = encodeId(row.original.id);
  const capabilities = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);
  const isDraft = row.original.status === SurveyStatusEnum.DRAFT;
  const isClosed = row.original.status === SurveyStatusEnum.CLOSED;

  return (
    <ActionCellContainer className='justify-end'>
      {/* Preview — PSP Admin + Brand Admin */}
      {capabilities.canPreviewSurvey && (
        <ActionButtonCell
          icon={<EyeIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
          tooltip={t('actions.viewSurvey')}
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}/${id}/preview`}
          className='hover:bg-[var(--primary-300)]'
        />
      )}

      {/* Edit — PSP Admin only, DRAFT surveys */}
      {capabilities.canEditSurvey && isDraft && (
        <ActionButtonCell
          icon={<EditIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
          tooltip={t('actions.editSurvey')}
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}/${id}/edit`}
          className='hover:bg-[var(--primary-300)]'
        />
      )}

      {/* Delete — PSP Admin only, DRAFT surveys */}
      {capabilities.canDeleteSurvey && isDraft && (
        <ActionButtonCell
          icon={<TrashIcon className='size-[18px] text-destructive' aria-hidden='true' />}
          tooltip={t('actions.deleteSurvey')}
          onClick={() => {
            onDelete(row.original);
          }}
          className='hover:bg-red-50'
        />
      )}

      {/* Assign to Brand — PSP Admin only */}
      {capabilities.canAssignToBrand && !isClosed && (
        <ActionButtonCell
          icon={
            <AssignToBrandIcon
              className='size-[18px] text-[var(--primary-500)]'
              aria-hidden='true'
            />
          }
          tooltip={t('actions.assignToBrand')}
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}/${id}/assign-brand`}
          className='hover:bg-[var(--primary-300)]'
        />
      )}

      {/* Assign to Stores — Brand Admin only */}
      {capabilities.canAssignToStore && !isClosed && (
        <ActionButtonCell
          icon={<StoreIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
          tooltip={t('actions.assignToStore')}
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}/${id}/assign-store`}
          className='hover:bg-[var(--primary-300)]'
        />
      )}

      {/* View Response — users with response-view capability and if a response exists */}
      {capabilities.canViewResponse && row.original.surveyResponseId && (
        <ActionButtonCell
          icon={<EyeIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />}
          tooltip={t('actions.viewResponse')}
          onClick={() => {
            onViewResponse(row.original);
          }}
          className='hover:bg-[var(--primary-300)]'
        />
      )}

      {/* Add Response — Store Admin only and if no response exists */}
      {capabilities.canAddResponse && !isClosed && !row.original.surveyResponseId && (
        <ActionButtonCell
          icon={
            <AddResponseIcon className='size-[18px] text-[var(--primary-500)]' aria-hidden='true' />
          }
          tooltip={t('actions.addResponse')}
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}/${id}/add-response`}
          className='hover:bg-[var(--primary-300)]'
        />
      )}
    </ActionCellContainer>
  );
}
