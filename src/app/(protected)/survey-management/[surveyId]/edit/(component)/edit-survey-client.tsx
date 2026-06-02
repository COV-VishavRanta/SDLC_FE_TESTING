'use client';

import { QuestionBuilder, SurveyCreatorProvider } from '@/components';
import type { TemplateQuestion } from '@/components/survey-creator';
import { SurveyStatusEnum, VALIDATION_LENGTH } from '@/constant';
import { GET_SURVEY_DETAIL, SurveyDetailData, SurveyDetailVars } from '@/graphql';
import { SurveyTemplateType } from '@/types';
import { useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import SurveyDetails from '../../(components)/survey-details/survey-details';
import TemplateQuestionsSettingSection from '../../(components)/template-questions-setting-section/template-questions-setting-section';
import EditSurveyLoading from '../loading';
import { EditSurveyHeader } from './edit-template-header';

/* ── Edit Survey Client Page ── */
interface EditSurveyClientProps {
  surveyId: string;
}

export default function EditSurveyClient({ surveyId }: EditSurveyClientProps) {
  const t = useTranslations('surveyManagement.edit.details');

  const { data, loading: surveyDetailLoading } = useQuery<SurveyDetailData, SurveyDetailVars>(
    GET_SURVEY_DETAIL,
    {
      variables: { surveyId },
    },
  );

  const survey = data?.surveyDetail?.survey;

  /* ── Name state ── */
  const [surveyName, setSurveyName] = useState('');
  const [nameError, setNameError] = useState<'required' | 'maxLength' | null>(null);

  /* ── Description state ── */
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  /* ── Template / schema state ── */
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeSchemaJson, setActiveSchemaJson] = useState<string>('[]');
  const [schemaVersion, setSchemaVersion] = useState(0);

  /* Initialize from survey data once */
  const initializedRef = useRef(false);
  useEffect(() => {
    if (survey && !initializedRef.current) {
      if (survey?.status !== SurveyStatusEnum.DRAFT) {
        throw new Error('Only draft surveys can be edited');
      }

      initializedRef.current = true;
      setSurveyName(survey.name);
      setDescription(survey.description ?? '');
      setActiveSchemaJson(survey.schemaJson ?? '[]');
      setSelectedTemplateId(survey.templateId ?? null);
      setSchemaVersion((v) => v + 1);
    }
  }, [survey]);

  const validateName = useCallback(() => {
    if (surveyName.trim().length === 0) {
      setNameError('required');
    } else if (surveyName.length > VALIDATION_LENGTH.SURVEY.NAME.MAX) {
      setNameError('maxLength');
    } else {
      setNameError(null);
    }
  }, [surveyName]);

  const validateDescription = useCallback(() => {
    if (description.trim().length === 0) {
      setDescriptionError(t('descriptionRequiredError'));
    } else if (description.length > VALIDATION_LENGTH.SURVEY.DESCRIPTION.MAX) {
      setDescriptionError(t('descriptionMaxLengthError'));
    } else {
      setDescriptionError(null);
    }
  }, [description, t]);

  const handleTemplateChange = useCallback((template: SurveyTemplateType) => {
    setSelectedTemplateId(template.id);
    setActiveSchemaJson(template.schemaJson ?? '[]');
    setSchemaVersion((v) => v + 1);
  }, []);

  const handleTemplateDeselect = useCallback(() => {
    setSelectedTemplateId(null);
  }, []);

  const initialQuestions = useMemo<TemplateQuestion[]>(() => {
    try {
      return JSON.parse(activeSchemaJson) as TemplateQuestion[];
    } catch {
      return [];
    }
    // schemaVersion ensures this re-runs when template changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSchemaJson, schemaVersion]);

  if (surveyDetailLoading) {
    return <EditSurveyLoading />;
  }

  return (
    <SurveyCreatorProvider key={schemaVersion} initialQuestions={initialQuestions}>
      <EditSurveyHeader
        surveyId={surveyId}
        surveyName={surveyName}
        description={description}
        selectedTemplateId={selectedTemplateId}
        onNameBlur={validateName}
        onDescriptionBlur={validateDescription}
        onTemplateChange={handleTemplateChange}
        onTemplateDeselect={handleTemplateDeselect}
      />

      <div className='flex flex-col gap-12'>
        <div className='flex flex-col gap-5 xl:flex-row xl:items-start'>
          <div className='flex min-w-0 flex-1 flex-col gap-5'>
            <SurveyDetails
              surveyName={surveyName}
              setSurveyName={setSurveyName}
              nameError={nameError}
              validateName={validateName}
              setNameError={setNameError}
              description={description}
              setDescription={setDescription}
              descriptionError={descriptionError}
              validateDescription={validateDescription}
              setDescriptionError={setDescriptionError}
            />
            <QuestionBuilder />
          </div>
          <TemplateQuestionsSettingSection />
        </div>
      </div>
    </SurveyCreatorProvider>
  );
}
