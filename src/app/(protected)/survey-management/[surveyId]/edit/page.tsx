import { PageRoot, SurveyCapabilitiesGuard } from '@/components';
import { decodeId } from '@/lib';

import EditSurveyClient from './(component)/edit-survey-client';

interface EditSurveyPageProps {
  params: Promise<{ surveyId: string }>;
}

export default async function EditSurveyPage({ params }: EditSurveyPageProps) {
  const { surveyId } = await params;

  const decodedId = decodeId(surveyId);

  return (
    <SurveyCapabilitiesGuard subPage='editSurvey'>
      <PageRoot>
        <EditSurveyClient surveyId={decodedId} />
      </PageRoot>
    </SurveyCapabilitiesGuard>
  );
}
