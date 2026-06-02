import { ArrowLeftIcon, Button, useSurveyCreator } from '@/components';
import { ProtectedRoute } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_SURVEY_TEMPLATE,
  CreateSurveyTemplateInput,
  SurveyTemplatePayload,
} from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

/* ── Save button wired to survey creator validation and mutation ── */
interface TemplateHeaderProps {
  templateName: string;
  onNameBlur: () => void;
}

export default function TemplateHeader({ templateName, onNameBlur }: TemplateHeaderProps) {
  const tCreate = useTranslations('surveyManagement.template.create');
  const tCommon = useTranslations('surveyManagement.template.common-template');
  const { validate, questions } = useSurveyCreator();
  const { selectedPspId } = useGlobalProtected();
  const router = useRouter();

  const [createSurveyTemplate, { loading }] = useMutation<
    { createSurveyTemplate: SurveyTemplatePayload },
    { input: CreateSurveyTemplateInput }
  >(CREATE_SURVEY_TEMPLATE);

  const handleSave = useCallback(async () => {
    onNameBlur();
    const basicInfoValid = templateName.trim().length > 0;
    const questionsValid = validate();
    if (!basicInfoValid || !questionsValid || !selectedPspId) return;

    await createSurveyTemplate({
      variables: {
        input: {
          pspId: selectedPspId,
          name: templateName.trim(),
          schemaJson: JSON.stringify(questions),
        },
      },
      onCompleted: () => {
        toast.success(tCreate('success'));
        router.push(ProtectedRoute.SURVEY_MANAGEMENT);
      },
    });
  }, [
    templateName,
    validate,
    questions,
    selectedPspId,
    createSurveyTemplate,
    onNameBlur,
    tCreate,
    router,
  ]);

  return (
    <>
      {/* Back Link */}
      <Link
        href={ProtectedRoute.SURVEY_MANAGEMENT}
        className='flex w-fit items-center gap-2.5 py-[3px] text-[14px] font-medium leading-[21px] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-4' aria-hidden='true' />
        {tCommon('backLink')}
      </Link>
      {/* Title and Actions */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
          {tCreate('pageTitle')}
        </h1>
        <Button
          className='h-12 rounded-lg bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] px-6 text-[16px] font-medium text-white hover:opacity-90'
          onClick={handleSave}
          disabled={loading}
          aria-busy={loading}
          aria-label={loading ? tCommon('savingButton') : tCommon('saveButton')}
        >
          {loading ? tCommon('savingButton') : tCommon('saveButton')}
        </Button>
      </div>
    </>
  );
}
