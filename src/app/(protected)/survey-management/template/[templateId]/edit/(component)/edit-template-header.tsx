import { ArrowLeftIcon, Button, useSurveyCreator } from '@/components';
import { ProtectedRoute, VALIDATION_LENGTH } from '@/constant';
import {
  SurveyTemplatePayload,
  UPDATE_SURVEY_TEMPLATE,
  UpdateSurveyTemplateInput,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

/* ── Edit Header ── */
interface EditTemplateHeaderProps {
  templateId: string;
  templateName: string;
  onNameBlur: () => void;
}

export function EditTemplateHeader({
  templateId,
  templateName,
  onNameBlur,
}: EditTemplateHeaderProps) {
  const t = useTranslations('surveyManagement.template');
  const { validate, questions } = useSurveyCreator();
  const router = useRouter();

  const [updateSurveyTemplate, { loading }] = useMutation<
    { updateSurveyTemplate: SurveyTemplatePayload },
    { input: UpdateSurveyTemplateInput }
  >(UPDATE_SURVEY_TEMPLATE);

  const handleSave = useCallback(async () => {
    onNameBlur();
    const basicInfoValid =
      templateName.trim().length > 0 &&
      templateName.length <= VALIDATION_LENGTH.SURVEY.TEMPLATE_NAME.MAX;
    const questionsValid = validate();
    if (!basicInfoValid || !questionsValid) return;

    await updateSurveyTemplate({
      variables: {
        input: {
          surveyTemplateId: templateId,
          name: templateName.trim(),
          schemaJson: JSON.stringify(questions),
        },
      },
      onCompleted: () => {
        toast.success(t('edit.success'));
        router.push(ProtectedRoute.SURVEY_MANAGEMENT);
      },
    });
  }, [templateId, templateName, validate, questions, updateSurveyTemplate, onNameBlur, t, router]);

  return (
    <>
      <Link
        href={ProtectedRoute.SURVEY_MANAGEMENT}
        className='flex w-fit items-center gap-2.5 py-[3px] text-[14px] font-medium leading-[21px] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-4' aria-hidden='true' />
        {t('edit.backLink')}
      </Link>
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
          {t('edit.pageTitle')}
        </h1>
        <Button
          className='h-12 rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[16px] font-medium text-white hover:opacity-90'
          onClick={handleSave}
          disabled={loading}
          aria-busy={loading}
          aria-label={loading ? t('edit.savingButton') : t('edit.saveButton')}
        >
          {loading ? t('edit.savingButton') : t('edit.saveButton')}
        </Button>
      </div>
    </>
  );
}
