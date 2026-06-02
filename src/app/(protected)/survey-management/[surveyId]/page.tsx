import { PageRoot } from '@/components';
import { decodeId } from '@/lib';
import type { Metadata } from 'next';

import { SurveyDetailClient } from './(components)/survey-detail-client/survey-detail-client';

interface PageProps {
  params: Promise<{ surveyId: string }>;
}

export function generateMetadata(): Metadata {
  const title = 'Survey Details';
  return {
    title: `${title} — Pop Logic`,
  };
}

export default async function SurveyDetailPage({ params }: PageProps) {
  const { surveyId } = await params;
  const decodedSurveyId = decodeId(surveyId);

  return (
    <PageRoot>
      <SurveyDetailClient surveyId={decodedSurveyId} />
    </PageRoot>
  );
}
