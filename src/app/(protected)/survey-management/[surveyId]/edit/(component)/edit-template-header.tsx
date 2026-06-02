'use client';

import {
  ArrowLeftIcon,
  Button,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useSurveyCreator,
} from '@/components';
import { ProtectedRoute, SurveyTemplateSortField, VALIDATION_LENGTH } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  GET_SURVEY_TEMPLATES,
  ListSurveyTemplatesData,
  ListSurveyTemplatesVars,
  UPDATE_SURVEY,
  UpdateSurveyResponse,
  UpdateSurveyVariables,
} from '@/graphql';
import { SurveyTemplateType } from '@/types';
import { useMutation, useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

const TEMPLATE_QUERY_VARS: Omit<ListSurveyTemplatesVars, 'pspId'> = {
  page: 1,
  pageSize: -1,
  isActive: true,
  sort: { field: SurveyTemplateSortField.NAME, order: 'ASC' },
};

/* ── Edit Survey Header ── */
interface EditSurveyHeaderProps {
  surveyId: string;
  surveyName: string;
  description: string;
  selectedTemplateId: string | null;
  onNameBlur: () => void;
  onDescriptionBlur: () => void;
  onTemplateChange: (template: SurveyTemplateType) => void;
  onTemplateDeselect: () => void;
}

export function EditSurveyHeader({
  surveyId,
  surveyName,
  description,
  selectedTemplateId,
  onNameBlur,
  onDescriptionBlur,
  onTemplateChange,
  onTemplateDeselect,
}: EditSurveyHeaderProps) {
  const t = useTranslations('surveyManagement.edit');
  const { validate, questions } = useSurveyCreator();
  const router = useRouter();
  const { selectedPspId } = useGlobalProtected();

  const { data: templatesData, loading: templatesLoading } = useQuery<
    ListSurveyTemplatesData,
    ListSurveyTemplatesVars
  >(GET_SURVEY_TEMPLATES, {
    variables: { pspId: selectedPspId ?? '', ...TEMPLATE_QUERY_VARS },
    skip: !selectedPspId,
  });

  const templates = templatesData?.listSurveyTemplates.surveyTemplates ?? [];
  const sortedTemplates = [...templates].sort((a, b) => a.name.localeCompare(b.name));

  const selectedTemplate = sortedTemplates.find((tpl) => tpl.id === selectedTemplateId) ?? null;

  const [updateSurvey, { loading }] = useMutation<UpdateSurveyResponse, UpdateSurveyVariables>(
    UPDATE_SURVEY,
  );

  const handleSave = useCallback(async () => {
    onNameBlur();
    onDescriptionBlur();
    const nameValid =
      surveyName.trim().length > 0 && surveyName.length <= VALIDATION_LENGTH.SURVEY.NAME.MAX;
    const descriptionValid =
      description.trim().length > 0 &&
      description.length <= VALIDATION_LENGTH.SURVEY.DESCRIPTION.MAX;
    const questionsValid = validate();
    if (!nameValid || !descriptionValid || !questionsValid) return;

    await updateSurvey({
      variables: {
        input: {
          surveyId,
          name: surveyName.trim(),
          description: description.trim(),
          schemaJson: JSON.stringify(questions),
          surveyTemplateId: selectedTemplateId ?? null,
        },
      },
      onCompleted: () => {
        toast.success(t('success'));
        router.push(`${ProtectedRoute.SURVEY_MANAGEMENT}?tab=surveys`);
      },
    });
  }, [
    surveyId,
    surveyName,
    description,
    selectedTemplateId,
    validate,
    questions,
    updateSurvey,
    onNameBlur,
    onDescriptionBlur,
    t,
    router,
  ]);

  return (
    <>
      <Link
        href={`${ProtectedRoute.SURVEY_MANAGEMENT}?tab=surveys`}
        className='flex w-fit items-center gap-2.5 py-[3px] text-[14px] font-medium leading-[21px] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-4' aria-hidden='true' />
        {t('backLink')}
      </Link>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)] sm:text-[24px] lg:text-[28px]'>
          {t('pageTitle')}
        </h1>
        <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center'>
          {/* Select Template Combobox */}
          <div className='w-full sm:w-[220px]'>
            <Combobox
              items={sortedTemplates}
              itemToStringLabel={(item: SurveyTemplateType) => item.name}
              itemToStringValue={(item: SurveyTemplateType) => item.id}
              value={selectedTemplate}
              onValueChange={(item: SurveyTemplateType | null) => {
                if (item) {
                  onTemplateChange(item);
                } else {
                  onTemplateDeselect();
                }
              }}
              disabled={templatesLoading}
            >
              <ComboboxInput
                className='bg-white'
                aria-label={t('selectTemplateButton')}
                placeholder={templatesLoading ? 'Loading...' : t('templatePlaceholder')}
                isLoading={templatesLoading}
                showClear={!!selectedTemplate}
              />
              <ComboboxContent>
                <ComboboxList>
                  {sortedTemplates.length === 0 && !templatesLoading ? (
                    <div className='py-2 text-center text-[13px] text-[var(--neutral-500)]'>
                      {t('templateNoOptions')}
                    </div>
                  ) : (
                    templates.map((template) => (
                      <ComboboxItem key={template.id} value={template}>
                        {template.name}
                      </ComboboxItem>
                    ))
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Save Survey Button */}
          <Button
            className='h-12 w-full rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[16px] font-medium text-white hover:opacity-90 sm:w-auto'
            onClick={handleSave}
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? t('savingButton') : t('saveButton')}
          >
            {loading ? t('savingButton') : t('saveButton')}
          </Button>
        </div>
      </div>
    </>
  );
}
