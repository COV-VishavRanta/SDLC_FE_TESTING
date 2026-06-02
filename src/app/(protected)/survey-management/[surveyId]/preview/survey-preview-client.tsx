'use client';

import { SurveyPreview } from '@/components';
import type { TemplateQuestion } from '@/components/survey-creator';
import { GET_SURVEY_DETAIL, SurveyDetailData, SurveyDetailVars } from '@/graphql';
import { decodeId } from '@/lib';
import { useSuspenseQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import SurveyPreviewHeader from './survey-preview-header';

interface SurveyPreviewClientProps {
  encodedId: string;
}

export default function SurveyPreviewClient({ encodedId }: SurveyPreviewClientProps) {
  const surveyId = useMemo(() => decodeId(encodedId), [encodedId]);

  const { data } = useSuspenseQuery<SurveyDetailData, SurveyDetailVars>(GET_SURVEY_DETAIL, {
    variables: { surveyId },
  });

  const survey = data?.surveyDetail?.survey;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const questions = useMemo<TemplateQuestion[]>(() => {
    try {
      return JSON.parse(survey?.schemaJson ?? '[]') as TemplateQuestion[];
    } catch {
      return [];
    }
  }, [survey?.schemaJson]);

  return (
    <>
      <SurveyPreviewHeader surveyId={surveyId} surveyStatus={survey?.status} />
      <SurveyPreview
        questions={questions}
        templateName={survey?.name ?? ''}
        templateDescription={survey?.description ?? ''}
      />
    </>
  );
}
