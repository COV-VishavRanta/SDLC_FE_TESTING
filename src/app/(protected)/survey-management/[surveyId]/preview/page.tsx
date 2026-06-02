import { ArrowLeftIcon, PageRoot, SurveyCapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import SurveyPreviewClient from './survey-preview-client';

interface SurveyPreviewPageProps {
  params: Promise<{ surveyId: string }>;
}

export default async function SurveyPreviewPage({ params }: SurveyPreviewPageProps) {
  const { surveyId } = await params;
  const t = await getTranslations('surveyPreview');

  return (
    <SurveyCapabilitiesGuard subPage='previewSurvey'>
      <PageRoot>
        {/* Back Link */}
        <Link
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}?tab=surveys`}
          className='flex w-fit items-center gap-2.5 py-[3px] text-[14px] font-medium leading-[21px] text-[var(--primary-400)] hover:underline'
        >
          <ArrowLeftIcon className='size-4' aria-hidden='true' />
          {t('backToSurveyEditor')}
        </Link>

        {/* Survey Preview Component which includes Header */}
        <SurveyPreviewClient encodedId={surveyId} />
      </PageRoot>
    </SurveyCapabilitiesGuard>
  );
}
