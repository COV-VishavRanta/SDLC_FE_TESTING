import { ArrowLeftIcon, PageRoot, SurveyCapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import { decodeId } from '@/lib';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Suspense } from 'react';

import { AssignStoreTable } from './(components)/assign-store-table';
import { AssignStoreTableSkeleton } from './(components)/assign-store-table.loading';

interface PageProps {
  params: Promise<{ surveyId: string }>;
}

export default async function AssignStoreToSurveyPage({ params }: PageProps) {
  const t = await getTranslations('assignStore');
  const { surveyId } = await params;
  const decodedSurveyId = await decodeId(surveyId);

  return (
    <SurveyCapabilitiesGuard subPage='assignStore'>
      <PageRoot>
        {/* Back link */}
        <Link
          href={ProtectedRoute.SURVEY_MANAGEMENT}
          className='flex w-fit items-center gap-1.5 text-[14px] font-medium text-[var(--primary-400)] hover:underline'
          aria-label={t('backLink')}
        >
          <ArrowLeftIcon className='size-4' aria-hidden='true' />
          {t('backLink')}
        </Link>

        {/* Page title */}
        <h1 className='text-[24px] font-bold leading-8 tracking-[-0.3px] text-[var(--neutral-900)]'>
          {t('pageTitle')}
        </h1>

        {/* Table */}
        <Suspense fallback={<AssignStoreTableSkeleton />}>
          <AssignStoreTable surveyId={decodedSurveyId} />
        </Suspense>
      </PageRoot>
    </SurveyCapabilitiesGuard>
  );
}
