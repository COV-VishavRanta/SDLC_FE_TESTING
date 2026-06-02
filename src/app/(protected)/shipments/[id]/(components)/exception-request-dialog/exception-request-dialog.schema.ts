import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type ExceptionRequestValidationT = ReturnType<
  typeof useTranslations<'shipmentDetails.exceptionDialog.validation'>
>;

/* ─── Schema Factory Function ─── */
export const createExceptionRequestSchema = (t: ExceptionRequestValidationT) =>
  z.object({
    reason: z
      .string()
      .trim()
      .min(1, t('reasonRequired'))
      .max(VALIDATION_LENGTH.SHIPMENT_EXCEPTION.REASON.MAX, t('reasonMax')),

    images: z
      .array(
        z
          .custom<File>((val) => val instanceof File)
          .refine(
            (val) =>
              (
                VALIDATION_LENGTH.SHIPMENT_EXCEPTION.IMAGE.ALLOWED_TYPES as readonly string[]
              ).includes((val as File).type),
            t('fileTypeInvalid'),
          )
          .refine(
            (val) =>
              (val as File).size <= VALIDATION_LENGTH.SHIPMENT_EXCEPTION.IMAGE.MAX_SIZE_BYTES,
            t('fileSizeExceeded'),
          ),
      )
      .min(1, t('imagesRequired')),
  });

export type ExceptionRequestFormData = z.infer<ReturnType<typeof createExceptionRequestSchema>>;
