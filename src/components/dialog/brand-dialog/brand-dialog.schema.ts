import { VALIDATION_LENGTH, ZIP_CODE_REGEX } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type BrandValidationT = ReturnType<typeof useTranslations<'brandManagement.dialog.validation'>>;

/* ─── Schema Factory Function ─── */
export const createBrandFormSchema = (t: BrandValidationT) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t('brandNameRequired'))
      .min(VALIDATION_LENGTH.NAME.MIN, t('brandNameMinLength'))
      .max(VALIDATION_LENGTH.NAME.MAX, t('brandNameMaxLength')),

    country: z
      .string({
        error: t('countryRequired'),
      })
      .trim()
      .min(1, t('countryRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.COUNTRY.MIN, t('countryMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.COUNTRY.MAX, t('countryMaxLength')),

    state: z
      .string({
        error: t('stateRequired'),
      })
      .trim()
      .min(1, t('stateRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.STATE.MIN, t('stateMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.STATE.MAX, t('stateMaxLength')),

    city: z
      .string({
        error: t('cityRequired'),
      })
      .trim()
      .min(1, t('cityRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.CITY.MIN, t('cityMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.CITY.MAX, t('cityMaxLength')),

    streetAddress: z
      .string({
        error: t('streetAddressRequired'),
      })
      .trim()
      .min(1, t('streetAddressRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.STREET.MIN, t('streetAddressMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.STREET.MAX, t('streetAddressMaxLength')),

    zipCode: z
      .string()
      .trim()
      .min(1, t('zipCodeRequired'))
      .regex(ZIP_CODE_REGEX, t('zipCodeInvalid'))
      .min(VALIDATION_LENGTH.ADDRESS.ZIP_CODE.MIN, t('zipCodeLength'))
      .max(VALIDATION_LENGTH.ADDRESS.ZIP_CODE.MAX, t('zipCodeLength')),

    website: z
      .url(t('websiteInvalid'))
      .trim()
      .max(VALIDATION_LENGTH.CONTACT.WEBSITE.MAX, t('websiteMaxLength'))
      .optional()
      .or(z.literal('')),
  });

/* ─── Types ─── */
export type BrandFormData = z.infer<ReturnType<typeof createBrandFormSchema>>;
