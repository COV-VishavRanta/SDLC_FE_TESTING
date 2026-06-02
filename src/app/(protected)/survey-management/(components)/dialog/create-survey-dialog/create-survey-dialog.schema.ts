import { VALIDATION_LENGTH } from '@/constant';
import { z } from 'zod';

/* ─── Translated validation messages ─── */
export interface SurveyValidationMessages {
  nameRequired: string;
  nameMinLength: string;
  nameMaxLength: string;
  descriptionRequired: string;
  descriptionMaxLength: string;
}

/* ─── Schema factory ─── */
export const createSurveyDialogSchema = (messages: SurveyValidationMessages) =>
  z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .min(VALIDATION_LENGTH.SURVEY.NAME.MIN, messages.nameMinLength)
      .max(VALIDATION_LENGTH.SURVEY.NAME.MAX, messages.nameMaxLength),

    description: z
      .string()
      .min(1, messages.descriptionRequired)
      .max(VALIDATION_LENGTH.SURVEY.DESCRIPTION.MAX, messages.descriptionMaxLength),

    templateId: z.string().optional(),
  });

/* ─── Types ─── */
export type CreateSurveyFormData = z.infer<ReturnType<typeof createSurveyDialogSchema>>;
