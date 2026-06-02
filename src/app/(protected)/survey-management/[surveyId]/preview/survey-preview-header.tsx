'use client';

import { Button } from '@/components';
import { SurveyStatusEnum } from '@/constant';
import { encodeId } from '@/lib';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface SurveyPreviewHeaderProps {
  surveyId: string;
  surveyStatus?: SurveyStatusEnum;
}

export default function SurveyPreviewHeader({ surveyId, surveyStatus }: SurveyPreviewHeaderProps) {
  const decodedSurveyId = encodeId(surveyId);
  const t = useTranslations('surveyPreview');

  return (
    <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
      <div className='flex items-center gap-3'>
        <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
          {t('surveyPreview')}
        </h1>
      </div>
      {surveyStatus === SurveyStatusEnum.DRAFT && (
        <Button
          variant='outline'
          className='h-12 rounded-lg border border-[var(--primary-500)] bg-transparent px-6 text-[16px] font-medium text-[var(--primary-500)] hover:bg-[var(--primary-300)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          nativeButton={false}
          render={
            <Link href={`/survey-management/${decodedSurveyId}/edit`}>{t('backToEditor')}</Link>
          }
        />
      )}
    </div>
  );
}
