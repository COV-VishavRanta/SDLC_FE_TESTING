'use client';

import { PageRoot, QuestionBuilder, SurveyCreatorProvider } from '@/components';
import type { TemplateQuestion } from '@/components/survey-creator';
import { VALIDATION_LENGTH } from '@/constant';
import {
  GET_SURVEY_TEMPLATE_DETAIL,
  SurveyTemplateDetailData,
  SurveyTemplateDetailVars,
} from '@/graphql';
import { useQuery } from '@apollo/client/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import TemplateDetails from '../../../(components)/template-details/template-details';
import TemplateQuestionsSettingSection from '../../../(components)/template-questions-setting-section/template-questions-setting-section';
import EditTemplateLoading from '../loading';
import { EditTemplateHeader } from './edit-template-header';

/* ── Edit Template Client Page ── */
interface EditTemplateClientProps {
  templateId: string;
}

export default function EditTemplateClient({ templateId }: EditTemplateClientProps) {
  const { data, loading } = useQuery<SurveyTemplateDetailData, SurveyTemplateDetailVars>(
    GET_SURVEY_TEMPLATE_DETAIL,
    { variables: { surveyTemplateId: templateId } },
  );

  const template = data?.surveyTemplateDetail.surveyTemplate;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const initialQuestions = useMemo<TemplateQuestion[]>(() => {
    try {
      return JSON.parse(template?.schemaJson ?? '[]') as TemplateQuestion[];
    } catch {
      return [];
    }
  }, [template?.schemaJson]);

  const [templateName, setTemplateName] = useState('');
  const [nameError, setNameError] = useState<'required' | 'maxLength' | null>(null);

  // Sync template name once it is loaded
  useEffect(() => {
    if (template?.name && !templateName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTemplateName(template.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template?.name]);

  const validateName = useCallback(() => {
    if (templateName.trim().length === 0) {
      setNameError('required');
    } else if (templateName.length > VALIDATION_LENGTH.SURVEY.TEMPLATE_NAME.MAX) {
      setNameError('maxLength');
    } else {
      setNameError(null);
    }
  }, [templateName]);

  if (loading) return <EditTemplateLoading />;

  return (
    <SurveyCreatorProvider initialQuestions={initialQuestions}>
      <PageRoot>
        <EditTemplateHeader
          templateId={templateId}
          templateName={templateName}
          onNameBlur={validateName}
        />

        <div className='flex flex-col gap-12'>
          <div className='flex flex-col gap-5 xl:flex-row xl:items-start'>
            <div className='flex min-w-0 flex-1 flex-col gap-5'>
              <TemplateDetails
                templateName={templateName}
                setTemplateName={setTemplateName}
                nameError={nameError}
                setNameError={setNameError}
              />
              <QuestionBuilder />
            </div>
            <TemplateQuestionsSettingSection />
          </div>
        </div>
      </PageRoot>
    </SurveyCreatorProvider>
  );
}
