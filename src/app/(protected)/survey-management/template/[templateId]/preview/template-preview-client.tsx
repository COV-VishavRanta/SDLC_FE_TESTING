'use client';

import { SurveyPreview } from '@/components';
import type { TemplateQuestion } from '@/components/survey-creator';
import {
  GET_SURVEY_TEMPLATE_DETAIL,
  SurveyTemplateDetailData,
  SurveyTemplateDetailVars,
} from '@/graphql';
import { decodeId } from '@/lib';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';

interface TemplatePreviewClientProps {
  encodedId: string;
}

export default function TemplatePreviewClient({ encodedId }: TemplatePreviewClientProps) {
  const templateId = useMemo(() => decodeId(encodedId), [encodedId]);

  const { data, loading } = useQuery<SurveyTemplateDetailData, SurveyTemplateDetailVars>(
    GET_SURVEY_TEMPLATE_DETAIL,
    { variables: { surveyTemplateId: templateId } },
  );

  const template = data?.surveyTemplateDetail?.surveyTemplate;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const questions = useMemo<TemplateQuestion[]>(() => {
    try {
      return JSON.parse(template?.schemaJson ?? '[]') as TemplateQuestion[];
    } catch {
      return [];
    }
  }, [template?.schemaJson]);

  return (
    <SurveyPreview questions={questions} templateName={template?.name ?? ''} isLoading={loading} />
  );
}
