'use client';

import {
  Button,
  CloseIcon,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  Field,
  FieldError,
  FieldLabel,
  FormInputField,
  Textarea,
} from '@/components';
import { ProtectedRoute, SurveyTemplateSortField } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import {
  CREATE_SURVEY,
  CreateSurveyResponse,
  CreateSurveyVariables,
  GET_SURVEY_TEMPLATES,
  ListSurveyTemplatesData,
  ListSurveyTemplatesVars,
} from '@/graphql';
import { encodeId } from '@/lib';
import { SurveyTemplateType } from '@/types';
import { useMutation, useQuery } from '@apollo/client/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createSurveyDialogSchema, type CreateSurveyFormData } from './create-survey-dialog.schema';

interface CreateSurveyDialogProps {
  onClose: () => void;
}

const TEMPLATE_QUERY_VARS: Omit<ListSurveyTemplatesVars, 'pspId'> = {
  page: 1,
  pageSize: -1,
  isActive: true,
  sort: { field: SurveyTemplateSortField.NAME, order: 'ASC' },
};

export function CreateSurveyDialog({ onClose }: CreateSurveyDialogProps) {
  const t = useTranslations('surveyManagement.createSurveyDialog');
  const router = useRouter();
  const { selectedPspId } = useGlobalProtected();

  const schema = createSurveyDialogSchema({
    nameRequired: t('validation.nameRequired'),
    nameMinLength: t('validation.nameMinLength'),
    nameMaxLength: t('validation.nameMaxLength'),
    descriptionRequired: t('validation.descriptionRequired'),
    descriptionMaxLength: t('validation.descriptionMaxLength'),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSurveyFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', templateId: '' },
  });

  const { data: templatesData, loading: templatesLoading } = useQuery<
    ListSurveyTemplatesData,
    ListSurveyTemplatesVars
  >(GET_SURVEY_TEMPLATES, {
    variables: { pspId: selectedPspId ?? '', ...TEMPLATE_QUERY_VARS },
    skip: !selectedPspId,
  });

  const [createSurvey] = useMutation<CreateSurveyResponse, CreateSurveyVariables>(CREATE_SURVEY);

  const templates = templatesData?.listSurveyTemplates.surveyTemplates ?? [];

  const sortedTemplates = [...templates].sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (formData: CreateSurveyFormData) => {
    if (!selectedPspId) return;

    const selectedTemplate = sortedTemplates.find((tpl) => tpl.id === formData.templateId) ?? null;

    await createSurvey({
      variables: {
        input: {
          pspId: selectedPspId,
          name: formData.name,
          description: formData.description ?? '',
          schemaJson: selectedTemplate?.schemaJson ?? ({} as unknown as string),
          surveyTemplateId: selectedTemplate?.id ?? undefined,
        },
      },
      onCompleted: (data) => {
        const surveyId = data?.createSurvey?.survey?.id;
        const encodedSurveyId = encodeId(surveyId ?? '');
        toast.success(t('successToast'));
        router.push(`${ProtectedRoute.SURVEY_MANAGEMENT}/${encodedSurveyId}/edit`);
        onClose();
      },
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className='flex w-full flex-col gap-0 overflow-hidden rounded-2xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* ── Header ── */}
        <div className='flex items-center justify-between border-b border-[var(--neutral-300)] px-8 py-6'>
          <DialogTitle className='text-[20px] font-semibold leading-normal text-[var(--neutral-900)]'>
            {t('title')}
          </DialogTitle>
          <DialogClose
            render={
              <button
                type='button'
                className='flex size-6 shrink-0 cursor-pointer items-center justify-center text-[var(--neutral-500)] transition-colors hover:text-[var(--neutral-900)]'
                onClick={onClose}
                aria-label={t('cancelButton')}
              >
                <CloseIcon className='size-6' aria-hidden='true' />
              </button>
            }
          />
        </div>

        {/* ── Body ── */}
        <form
          id='create-survey-form'
          aria-label={t('title')}
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-5 px-8 py-6'
        >
          {/* Survey Name */}
          <FormInputField<CreateSurveyFormData>
            id='name'
            label={t('nameLabel')}
            error={errors.name?.message}
            placeholder={t('namePlaceholder')}
            register={register}
            required
          />

          {/* Description */}
          <Field className='flex flex-col gap-2'>
            <FieldLabel
              htmlFor='survey-description'
              className='flex items-center text-[14px] font-medium leading-normal text-[var(--neutral-900)]'
              required
            >
              {t('descriptionLabel')}
            </FieldLabel>
            <Textarea
              id='survey-description'
              placeholder={t('descriptionPlaceholder')}
              aria-invalid={!!errors.description}
              rows={3}
              {...register('description')}
            />
            <FieldError
              className='text-[13px] sm:text-[14px] mt-[0.5rem]'
              errors={errors.description ? [{ message: errors.description.message }] : []}
            />
          </Field>

          {/* Template Combobox */}
          <Field className='flex flex-col gap-2'>
            <FieldLabel
              htmlFor='template-combobox'
              className='flex items-center text-[14px] font-medium leading-normal text-[var(--neutral-900)]'
            >
              {t('templateLabel')}
            </FieldLabel>
            <Controller
              control={control}
              name='templateId'
              render={({ field, fieldState: { error } }) => {
                const selectedTemplate =
                  sortedTemplates.find((tpl) => tpl.id === field.value) ?? null;
                return (
                  <>
                    <Combobox
                      items={sortedTemplates}
                      itemToStringLabel={(item: SurveyTemplateType) => item.name}
                      itemToStringValue={(item: SurveyTemplateType) => item.id}
                      value={selectedTemplate}
                      onValueChange={(item: SurveyTemplateType | null) => {
                        field.onChange(item?.id ?? '');
                      }}
                      disabled={templatesLoading}
                    >
                      <ComboboxInput
                        id='template-combobox'
                        aria-label={t('templateLabel')}
                        placeholder={templatesLoading ? 'Loading...' : t('templatePlaceholder')}
                        isLoading={templatesLoading}
                        aria-invalid={!!error}
                      />
                      <ComboboxContent>
                        <ComboboxList>
                          {sortedTemplates.length === 0 && !templatesLoading ? (
                            <div className='py-2 text-center text-[13px] text-[var(--neutral-500)]'>
                              {t('templateNoOptions')}
                            </div>
                          ) : (
                            sortedTemplates.map((template) => (
                              <ComboboxItem key={template.id} value={template}>
                                {template.name}
                              </ComboboxItem>
                            ))
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldError
                      className='text-[13px] sm:text-[14px] mt-[0.5rem]'
                      errors={error ? [{ message: error.message }] : []}
                    />
                  </>
                );
              }}
            />
          </Field>
        </form>

        {/* ── Footer ── */}
        <div className='flex items-center gap-3 border-t border-[var(--neutral-300)] px-8 py-[22px]'>
          <DialogClose
            render={
              <Button
                type='button'
                variant='outline'
                className='h-[43px] flex-1 rounded-[8px] border-[var(--neutral-300)] bg-[var(--neutral-200)] font-medium text-[var(--neutral-900)] sm:text-[16px]'
              >
                {t('cancelButton')}
              </Button>
            }
          />
          <Button
            type='submit'
            form='create-survey-form'
            disabled={isSubmitting}
            isLoading={isSubmitting}
            className='h-[44px] flex-1 rounded-[8px] bg-gradient-to-b from-[var(--btn-primary-from)] to-[var(--btn-primary-to)] font-medium text-white hover:from-[var(--primary-700)] hover:to-[var(--blue-dark)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[16px]'
          >
            {isSubmitting ? t('submitting') : t('createButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
