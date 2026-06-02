import { SurveyCapabilitiesGuard } from '@/components';
import { decodeId } from '@/lib';

import EditTemplateClient from './(component)/edit-template-client';

interface EditTemplatePageProps {
  params: Promise<{ templateId: string }>;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { templateId } = await params;

  const decodedId = decodeId(templateId);

  return (
    <SurveyCapabilitiesGuard subPage='templates'>
      <EditTemplateClient templateId={decodedId} />
    </SurveyCapabilitiesGuard>
  );
}
