import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type PromotionValidationT = ReturnType<
  typeof useTranslations<'campaignManagement.promotionDialog.validation'>
>;

/* ─── Schema Factory Function ─── */
export const createPromotionFormSchema = (t: PromotionValidationT) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, t('nameRequired'))
        .min(VALIDATION_LENGTH.PROMOTION.NAME.MIN, t('nameMinLength'))
        .max(VALIDATION_LENGTH.PROMOTION.NAME.MAX, t('nameMaxLength')),

      width: z
        .number({ error: t('widthRequired') })
        .positive(t('widthPositive'))
        .max(Number.MAX_SAFE_INTEGER, t('widthMaxDigits'))
        .refine((val) => {
          const parts = String(val).split('.');
          return parts.length === 1 || (parts[1]?.length ?? 0) <= 2;
        }, t('widthMaxDecimals')),

      height: z
        .number({ error: t('heightRequired') })
        .positive(t('heightPositive'))
        .max(Number.MAX_SAFE_INTEGER, t('heightMaxDigits'))
        .refine((val) => {
          const parts = String(val).split('.');
          return parts.length === 1 || (parts[1]?.length ?? 0) <= 2;
        }, t('heightMaxDecimals')),

      material: z
        .string()
        .trim()
        .max(VALIDATION_LENGTH.PROMOTION.MATERIAL.MAX, t('materialMaxLength'))
        .optional()
        .or(z.literal('')),

      specifications: z
        .string()
        .trim()
        .max(VALIDATION_LENGTH.PROMOTION.SPECIFICATIONS.MAX, t('specificationsMaxLength'))
        .optional()
        .or(z.literal('')),

      description: z
        .string()
        .trim()
        .max(VALIDATION_LENGTH.PROMOTION.DESCRIPTION.MAX, t('descriptionMaxLength'))
        .optional()
        .or(z.literal('')),

      needDesign: z.boolean(),

      isReusable: z.boolean(),

      image: z
        .custom<File>((val) => !val || val instanceof File)
        .refine(
          (val) =>
            !val ||
            (VALIDATION_LENGTH.PROMOTION.IMAGE.ALLOWED_TYPES as readonly string[]).includes(
              (val as File).type,
            ),
          t('fileTypeInvalid'),
        )
        .refine(
          (val) => !val || (val as File).size <= VALIDATION_LENGTH.PROMOTION.IMAGE.MAX_SIZE_BYTES,
          t('fileSizeExceeded'),
        )
        .optional(),

      /** Filename of an already-uploaded image (edit mode only). Cleared when user removes or replaces the image. */
      existingImageName: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Image is required when needDesign is false and there's no new file or existing server image.
      if (!data.needDesign && !data.image && !data.existingImageName) {
        ctx.addIssue({
          code: 'invalid_type',
          expected: 'File',
          received: 'undefined',
          message: t('imageRequired'),
          path: ['image'],
        });
      }
    });

/* ─── Types ─── */
export type PromotionFormData = z.infer<ReturnType<typeof createPromotionFormSchema>>;
