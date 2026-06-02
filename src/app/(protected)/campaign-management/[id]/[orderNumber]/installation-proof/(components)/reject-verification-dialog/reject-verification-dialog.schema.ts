import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type RejectVerificationValidationT = ReturnType<
  typeof useTranslations<'campaignManagement.details.verifyInstallationProof.rejectDialog.validation'>
>;

/* ─── Schema Factory ─── */
export const createRejectVerificationSchema = (t: RejectVerificationValidationT) =>
  z.object({
    notes: z
      .string()
      .min(1, t('reasonRequired'))
      .max(VALIDATION_LENGTH.INSTALLATION_PROOF.REJECTION_REASON.MAX, t('reasonMaxLength')),
  });

export type RejectVerificationFormData = z.infer<ReturnType<typeof createRejectVerificationSchema>>;
