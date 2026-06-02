import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type RejectInstallationProofValidationT = ReturnType<
  typeof useTranslations<'campaignManagement.details.verifyInstallationProof.rejectDialog.validation'>
>;

/* ─── Schema Factory ─── */
export const createRejectInstallationProofSchema = (t: RejectInstallationProofValidationT) =>
  z.object({
    notes: z
      .string()
      .min(1, t('reasonRequired'))
      .max(VALIDATION_LENGTH.INSTALLATION_PROOF.REJECTION_REASON.MAX, t('reasonMaxLength')),
  });

export type RejectInstallationProofFormData = z.infer<
  ReturnType<typeof createRejectInstallationProofSchema>
>;
