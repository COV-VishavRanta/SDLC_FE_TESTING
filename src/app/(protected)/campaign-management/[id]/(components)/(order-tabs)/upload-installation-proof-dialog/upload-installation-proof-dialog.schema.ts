import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type UploadInstallationProofValidationT = ReturnType<
  typeof useTranslations<'campaignManagement.details.ordersTab.uploadProofDialog.validation'>
>;

/* ─── Schema Factory ─── */
export const createUploadInstallationProofSchema = (t: UploadInstallationProofValidationT) =>
  z.object({
    images: z
      .array(
        z
          .custom<File>((val) => val instanceof File)
          .refine(
            (val) =>
              (
                VALIDATION_LENGTH.INSTALLATION_PROOF.IMAGE.ALLOWED_TYPES as readonly string[]
              ).includes((val as File).type),
            t('fileTypeInvalid'),
          )
          .refine(
            (val) =>
              (val as File).size <= VALIDATION_LENGTH.INSTALLATION_PROOF.IMAGE.MAX_SIZE_BYTES,
            t('fileSizeExceeded'),
          ),
      )
      .min(1, t('imagesRequired')),
    notes: z
      .string()
      .max(VALIDATION_LENGTH.INSTALLATION_PROOF.NOTES.MAX, t('notesMaxLength'))
      .optional(),
  });

export type UploadInstallationProofFormData = z.infer<
  ReturnType<typeof createUploadInstallationProofSchema>
>;
