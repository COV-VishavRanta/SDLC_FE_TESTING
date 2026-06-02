import { ArrowLeftIcon, PageRoot, SurveyCapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import { decodeId } from '@/lib';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { AssignBrandTable } from './(components)/assign-brand-table';

interface PageProps {
  params: Promise<{ surveyId: string }>;
}

export default async function AssignBrandToSurveyPage({ params }: PageProps) {
  const t = await getTranslations('assignBrand');
  const { surveyId } = await params;
  const decodedSurveyId = decodeId(surveyId);

  return (
    <SurveyCapabilitiesGuard subPage='assignBrand'>
      <PageRoot>
        {/* Back link */}
        <Link
          href={`${ProtectedRoute.SURVEY_MANAGEMENT}?tab=surveys`}
          className='flex w-fit items-center gap-1.5 text-[14px] font-medium text-[var(--primary-400)] hover:underline'
          aria-label={t('backLink')}
        >
          <ArrowLeftIcon className='size-4' />
          {t('backLink')}
        </Link>

        {/* Page title */}
        <h1 className='text-[24px] font-bold leading-8 tracking-[-0.3px] text-[var(--neutral-900)]'>
          {t('pageTitle')}
        </h1>
        <AssignBrandTable surveyId={decodedSurveyId} />
      </PageRoot>
    </SurveyCapabilitiesGuard>
  );
}
