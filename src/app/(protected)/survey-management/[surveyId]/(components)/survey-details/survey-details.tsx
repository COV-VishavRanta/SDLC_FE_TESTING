import { Input, Label, Textarea } from '@/components';
import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';

interface SurveyDetailsProps {
  surveyName: string;
  setSurveyName: (name: string) => void;
  nameError: 'required' | 'maxLength' | null;
  validateName: () => void;
  setNameError: (error: 'required' | 'maxLength' | null) => void;
  description: string;
  setDescription: (value: string) => void;
  descriptionError: string | null;
  validateDescription: () => void;
  setDescriptionError: (error: string | null) => void;
}

export default function SurveyDetails({
  surveyName,
  setSurveyName,
  nameError,
  validateName,
  setNameError,
  description,
  setDescription,
  descriptionError,
  validateDescription,
  setDescriptionError,
}: SurveyDetailsProps) {
  const t = useTranslations('surveyManagement.edit.details');

  return (
    <div className='flex flex-col gap-5'>
      <h2 className='text-[14px] font-medium leading-5 tracking-[-0.15px] text-(--neutral-900) sm:text-[16px]'>
        {t('sectionTitle')}
      </h2>
      <div className='flex flex-col gap-5 rounded-xl border border-(--neutral-300) bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8'>
        {/* Survey Name */}
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='survey-name-input'
            className='flex items-center gap-1 text-[14px] font-medium leading-normal text-(--neutral-900)'
          >
            {t('nameLabelRequired')}
            <span className='text-[16px] text-error' aria-hidden='true'>
              *
            </span>
          </Label>
          <Input
            id='survey-name-input'
            placeholder={t('namePlaceholder')}
            value={surveyName}
            variant={nameError !== null ? 'error' : 'default'}
            aria-required='true'
            aria-invalid={nameError !== null}
            aria-describedby={nameError !== null ? 'survey-name-error' : undefined}
            onChange={(e) => {
              const { value } = e.target;
              setSurveyName(value);
              if (nameError !== null) {
                if (value.trim().length === 0) {
                  setNameError('required');
                } else if (value.length > VALIDATION_LENGTH.SURVEY.NAME.MAX) {
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
            <p id='survey-name-error' role='alert' className='text-[12px] text-error'>
              {nameError === 'maxLength' ? t('nameMaxLengthError') : t('nameRequiredError')}
            </p>
          )}
        </div>

        {/* Description */}
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='survey-description-input'
            className='flex items-center gap-1 text-[14px] font-medium leading-normal text-(--neutral-900)'
          >
            {t('descriptionLabel')}
            <span className='text-[16px] text-error' aria-hidden='true'>
              *
            </span>
          </Label>
          <Textarea
            id='survey-description-input'
            placeholder={t('descriptionPlaceholder')}
            value={description}
            aria-required='true'
            aria-invalid={!!descriptionError}
            aria-describedby={descriptionError ? 'survey-description-error' : undefined}
            rows={3}
            onChange={(e) => {
              setDescription(e.target.value);
              if (descriptionError) {
                if (
                  e.target.value.trim().length > 0 &&
                  e.target.value.length <= VALIDATION_LENGTH.SURVEY.DESCRIPTION.MAX
                ) {
                  setDescriptionError(null);
                }
              }
            }}
            onBlur={validateDescription}
          />
          {descriptionError && (
            <p id='survey-description-error' role='alert' className='text-[12px] text-error'>
              {descriptionError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
