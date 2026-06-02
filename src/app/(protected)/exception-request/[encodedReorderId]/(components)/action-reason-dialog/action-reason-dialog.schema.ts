import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

type ActionReasonValidationT = ReturnType<
  typeof useTranslations<'reorderDetails.actionDialog.validation'>
>;

export const createActionReasonSchema = (t: ActionReasonValidationT) =>
  z.object({
    reason: z
      .string()
      .trim()
      .min(1, t('reasonRequired'))
      .max(VALIDATION_LENGTH.SHIPMENT_EXCEPTION.REASON.MAX, t('reasonMax')),
  });

export type ActionReasonFormData = z.infer<ReturnType<typeof createActionReasonSchema>>;
