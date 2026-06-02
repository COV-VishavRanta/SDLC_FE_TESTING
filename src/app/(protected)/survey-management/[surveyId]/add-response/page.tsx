import { ArrowLeftIcon, PageRoot, SurveyCapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import SurveyResponseClient from './survey-response-client';

interface PageProps {
  params: Promise<{ surveyId: string }>;
}

export default async function AddSurveyResponsePage({ params }: PageProps) {
  const { surveyId } = await params;
  const t = await getTranslations('surveyManagement');

  return (
    <SurveyCapabilitiesGuard subPage='addResponse'>
      <PageRoot>
        {/* Back link */}
        <Link
          href={ProtectedRoute.SURVEY_MANAGEMENT}
          className='flex w-fit items-center gap-1.5 text-[14px] font-medium text-[var(--primary-400)] hover:underline'
          aria-label={t('addResponse.backLink')}
        >
          <ArrowLeftIcon className='size-4' aria-hidden='true' />
          {t('addResponse.backLink')}
        </Link>

        {/* Page title */}
        <h1 className='text-[24px] font-bold leading-8 tracking-[-0.3px] text-[var(--neutral-900)]'>
          {t('addResponse.pageTitle')}
        </h1>

        {/* Survey response form */}
        <SurveyResponseClient encodedId={surveyId} />
      </PageRoot>
    </SurveyCapabilitiesGuard>
  );
}
