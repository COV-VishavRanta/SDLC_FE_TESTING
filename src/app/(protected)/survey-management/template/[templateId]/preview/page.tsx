import { ArrowLeftIcon, Button, PageRoot, SurveyCapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import TemplatePreviewClient from './template-preview-client';

interface TemplatePreviewPageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('surveyManagement.preview');
  return {
    title: t('pageTitle'),
  };
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const t = await getTranslations('surveyManagement.preview');
  const { templateId } = await params;

  return (
    <SurveyCapabilitiesGuard subPage='templates'>
      <PageRoot>
        {/* Back Link */}
        <Link
          href={ProtectedRoute.SURVEY_MANAGEMENT}
          className='flex w-fit items-center gap-2.5 py-[3px] text-[14px] font-medium leading-[21px] text-[var(--primary-400)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md'
        >
          <ArrowLeftIcon className='size-4' aria-hidden='true' />
          {t('backToManagement')}
        </Link>

        {/* Header */}
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='flex items-center gap-3'>
            <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
              {t('title')}
            </h1>
          </div>
          <Button
            variant='outline'
            className='h-12 rounded-lg border border-[var(--primary-500)] bg-transparent px-6 text-[16px] font-medium text-[var(--primary-500)] hover:bg-[var(--primary-300)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            nativeButton={false}
            render={
              <Link href={`/survey-management/template/${templateId}/edit`}>
                {t('backToEditor')}
              </Link>
            }
          />
        </div>

        <TemplatePreviewClient encodedId={templateId} />
      </PageRoot>
    </SurveyCapabilitiesGuard>
  );
}
