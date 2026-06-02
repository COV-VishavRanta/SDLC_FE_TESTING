'use client';

import { Button, PageDescription, PageHeader, PageTitle } from '@/components';
import { ProtectedRoute } from '@/constant';
import { useCapabilities } from '@/hooks';
import { DEFAULT_SURVEY_CAPABILITIES, SURVEY_CAPABILITIES_MAP } from '@/lib';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useContext } from 'react';

import { SurveyManagementContext } from '../../context/SurveyManagementContext';
import { CreateSurveyDialog } from '../dialog/create-survey-dialog/create-survey-dialog';

export default function SurveyManagementHeader() {
  const { activeTab, showCreateSurveyDialog, setShowCreateSurveyDialog } =
    useContext(SurveyManagementContext);
  const t = useTranslations('surveyManagement');
  const caps = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);

  const showCreateSurvey = caps.showCreateSurveyButton && activeTab === 'surveys';
  const showCreateTemplate = caps.showCreateTemplateButton && activeTab === 'templates';

  return (
    <>
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <PageHeader>
          <PageTitle className='font-semibold text-text-heading'>{t('page.title')}</PageTitle>
          <PageDescription>{t('page.description')}</PageDescription>
        </PageHeader>
        {showCreateSurvey && (
          <Button
            type='button'
            onClick={() => {
              setShowCreateSurveyDialog(true);
            }}
          >
            {t('page.createButton')}
          </Button>
        )}
        {showCreateTemplate && (
          <Button
            type='button'
            nativeButton={false}
            render={
              <Link href={ProtectedRoute.CREATE_SURVEY_TEMPLATE}>
                {t('page.createTemplateButton')}
              </Link>
            }
          >
            {t('page.createTemplateButton')}
          </Button>
        )}
      </div>

      {/* ── Create Survey Dialog ── */}
      {showCreateSurveyDialog && (
        <CreateSurveyDialog
          onClose={() => {
            setShowCreateSurveyDialog(false);
          }}
        />
      )}
    </>
  );
}
