'use client';

import type { TemplateQuestion } from '@/components/survey-creator';
import { SurveyStatusEnum } from '@/constant';
import { GET_SURVEY_DETAIL, type SurveyDetailData, type SurveyDetailVars } from '@/graphql';
import { decodeId } from '@/lib';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import SurveyResponseForm from './survey-response-form';

interface SurveyResponseClientProps {
  encodedId: string;
}

export default function SurveyResponseClient({ encodedId }: SurveyResponseClientProps) {
  const surveyId = useMemo(() => decodeId(encodedId), [encodedId]);
  const t = useTranslations('surveyManagement.addResponse');

  const { data } = useSuspenseQuery<SurveyDetailData, SurveyDetailVars>(GET_SURVEY_DETAIL, {
    variables: { surveyId },
  });

  const survey = data?.surveyDetail?.survey;

  if (survey?.status === SurveyStatusEnum.CLOSED) {
    return <p className='text-[14px] text-[var(--neutral-500)]'>{t('surveyClosed')}</p>;
  }

  const parsedQuestions = JSON.parse(survey?.schemaJson ?? '[]') as TemplateQuestion[];

  // check for if parsedQuestions is empty or not an array
  const questions = Array.isArray(parsedQuestions) ? parsedQuestions : [];

  return (
    <SurveyResponseForm surveyId={surveyId} surveyName={survey?.name ?? ''} questions={questions} />
  );
}
