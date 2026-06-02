import { VALIDATION_LENGTH, ZIP_CODE_REGEX } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type PspValidationT = ReturnType<typeof useTranslations<'pspManagement.dialog.validation'>>;

/* ─── Schema Factory Function ─── */
export const createPspFormSchema = (t: PspValidationT) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, t('companyNameRequired'))
      .min(VALIDATION_LENGTH.NAME.MIN, t('companyNameMinLength'))
      .max(VALIDATION_LENGTH.NAME.MAX, t('companyNameMaxLength')),

    streetAddress: z
      .string({
        error: t('streetAddressRequired'),
      })
      .trim()
      .min(1, t('streetAddressRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.STREET.MIN, t('streetAddressMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.STREET.MAX, t('streetAddressMaxLength')),

    city: z
      .string({
        error: t('cityRequired'),
      })
      .trim()
      .min(1, t('cityRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.CITY.MIN, t('cityMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.CITY.MAX, t('cityMaxLength')),

    state: z
      .string({
        error: t('stateRequired'),
      })
      .trim()
      .min(1, t('stateRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.STATE.MIN, t('stateMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.STATE.MAX, t('stateMaxLength')),

    zipCode: z
      .string()
      .trim()
      .min(1, t('zipCodeRequired'))
      .regex(ZIP_CODE_REGEX, t('zipCodeInvalid'))
      .min(VALIDATION_LENGTH.ADDRESS.ZIP_CODE.MIN, t('zipCodeLength'))
      .max(VALIDATION_LENGTH.ADDRESS.ZIP_CODE.MAX, t('zipCodeLength')),

    country: z
      .string({
        error: t('countryRequired'),
      })
      .trim()
      .min(1, t('countryRequired'))
      .min(VALIDATION_LENGTH.ADDRESS.COUNTRY.MIN, t('countryMinLength'))
      .max(VALIDATION_LENGTH.ADDRESS.COUNTRY.MAX, t('countryMaxLength')),

    website: z
      .url(t('websiteInvalid'))
      .trim()
      .max(VALIDATION_LENGTH.CONTACT.WEBSITE.MAX, t('websiteMaxLength'))
      .optional()
      .or(z.literal('')),
  });

/* ─── Types ─── */
export type PspFormData = z.infer<ReturnType<typeof createPspFormSchema>>;
