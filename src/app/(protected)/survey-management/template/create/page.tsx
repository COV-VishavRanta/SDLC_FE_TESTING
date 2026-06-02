'use client';

import {
  PageRoot,
  QuestionBuilder,
  SurveyCapabilitiesGuard,
  SurveyCreatorProvider,
} from '@/components';
import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import TemplateDetails from '../(components)/template-details/template-details';
import TemplateHeader from '../(components)/template-header/template-header';
import TemplateQuestionsSettingSection from '../(components)/template-questions-setting-section/template-questions-setting-section';

export default function CreateTemplatePage() {
  const t = useTranslations('surveyManagement.template.create');
  const [templateName, setTemplateName] = useState('');
  const [nameError, setNameError] = useState<'required' | 'maxLength' | null>(null);

  const validateName = useCallback(() => {
    if (templateName.trim().length === 0) {
      setNameError('required');
    } else if (templateName.length > VALIDATION_LENGTH.SURVEY.TEMPLATE_NAME.MAX) {
      setNameError('maxLength');
    } else {
      setNameError(null);
    }
  }, [templateName]);

  return (
    <SurveyCapabilitiesGuard subPage='templates'>
      <SurveyCreatorProvider>
        <PageRoot>
          <main aria-label={t('pageTitle')}>
            {/* Back Link + Title + Save Button */}
            <TemplateHeader templateName={templateName} onNameBlur={validateName} />

            <div className='flex flex-col gap-12'>
              {/* Main Content - Two Column Layout */}
              <div className='flex flex-col gap-5 xl:flex-row xl:items-start'>
                {/* Left Column - Template Details & Questions */}
                <div className='flex min-w-0 flex-1 flex-col gap-5'>
                  {/* Template Details Section */}
                  <TemplateDetails
                    templateName={templateName}
                    setTemplateName={setTemplateName}
                    nameError={nameError}
                    setNameError={setNameError}
                  />

                  {/* Questions Section — from composition component */}
                  <QuestionBuilder />
                </div>

                {/* Right Column - Question Settings (Sticky) */}
                <TemplateQuestionsSettingSection />
              </div>
            </div>
          </main>
        </PageRoot>
      </SurveyCreatorProvider>
    </SurveyCapabilitiesGuard>
  );
}
