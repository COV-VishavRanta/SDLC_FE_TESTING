import { Input, Label } from '@/components';
import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';

interface TemplateDetailsProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  nameError: 'required' | 'maxLength' | null;
  validateName: () => void;
  setNameError: (error: 'required' | 'maxLength' | null) => void;
}

export default function TemplateDetails({
  templateName,
  setTemplateName,
  nameError,
  validateName,
  setNameError,
}: TemplateDetailsProps) {
  const t = useTranslations('surveyManagement.template.common-template.details');

  return (
    <div className='flex flex-col gap-5'>
      <h2 className='text-[16px] font-medium leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
        {t('sectionTitle')}
      </h2>
      <div className='flex flex-col gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
        {/* Template Name */}
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='template-name-input'
            className='flex items-center gap-1 text-[14px] font-medium leading-normal text-[var(--neutral-900)]'
          >
            {t('nameLabelRequired')}
            <span className='text-[16px] text-[var(--error)]' aria-hidden='true'>
              *
            </span>
          </Label>
          <Input
            id='template-name-input'
            placeholder={t('namePlaceholder')}
            value={templateName}
            variant={nameError !== null ? 'error' : 'default'}
            aria-required='true'
            aria-invalid={nameError !== null}
            aria-describedby={nameError !== null ? 'template-name-error' : undefined}
            onChange={(e) => {
              const { value } = e.target;
              setTemplateName(value);
              if (nameError !== null) {
                if (value.trim().length === 0) {
                  setNameError('required');
                } else if (value.length > VALIDATION_LENGTH.SURVEY.TEMPLATE_NAME.MAX) {
                  setNameError('maxLength');
                } else {
                  setNameError(null);
                }
              }
            }}
            onBlur={validateName}
            className='w-full'
          />
          {nameError !== null && (
            <p id='template-name-error' role='alert' className='text-[12px] text-[var(--error)]'>
              {nameError === 'maxLength' ? t('nameMaxLengthError') : t('nameRequiredError')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
