import { Input, Label } from '@/components';
import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';

interface TemplateDetailsProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  nameError: 'required' | 'maxLength' | null;
  setNameError: (error: 'required' | 'maxLength' | null) => void;
}

export default function TemplateDetails({
  templateName,
  setTemplateName,
  nameError,
  setNameError,
}: TemplateDetailsProps) {
  const tDetails = useTranslations('surveyManagement.template.common-template.details');

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6'>
        {/* Template Name */}
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='template-name-input'
            className='flex items-center gap-1 text-[14px] font-medium leading-normal text-[var(--neutral-900)]'
          >
            {tDetails('nameLabelRequired')}
            <span className='text-[16px] text-[var(--error)]' aria-hidden='true'>
              *
            </span>
          </Label>
          <Input
            id='template-name-input'
            placeholder={tDetails('namePlaceholder')}
            value={templateName}
            variant={nameError ? 'error' : 'default'}
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
            className='w-full'
          />
          {nameError !== null && (
            <p id='template-name-error' role='alert' className='text-[12px] text-[var(--error)]'>
              {nameError === 'maxLength'
                ? tDetails('nameMaxLengthError')
                : tDetails('nameRequiredError')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
