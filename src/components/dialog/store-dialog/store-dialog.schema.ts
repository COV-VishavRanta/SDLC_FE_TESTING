import { PHONE_NUMBER_REGEX, VALIDATION_LENGTH, ZIP_CODE_REGEX } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

/* ─── Types ─── */
type StoreValidationT = ReturnType<typeof useTranslations<'storeManagement.dialog.validation'>>;

/* ─── Schema Factory Function ─── */
export const createStoreFormSchema = (t: StoreValidationT) =>
  z.object({
    storeName: z
      .string()
      .trim()
      .min(1, t('storeNameRequired'))
      .min(VALIDATION_LENGTH.NAME.MIN, t('storeNameMinLength'))
      .max(VALIDATION_LENGTH.NAME.MAX, t('storeNameMaxLength')),

    storeNumber: z
      .string()
      .trim()
      .max(VALIDATION_LENGTH.STORE.NUMBER.MAX, t('storeNumberMaxLength'))
      .optional()
      .or(z.literal('')),

    phoneNumber: z
      .string()
      .trim()
      .regex(PHONE_NUMBER_REGEX, t('phoneNumberInvalid'))
      .length(VALIDATION_LENGTH.CONTACT.PHONE.LENGTH, t('phoneNumberLength'))
      .optional()
      .or(z.literal('')),

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
  });

/* ─── Form Data Type ─── */
export type StoreFormData = z.infer<ReturnType<typeof createStoreFormSchema>>;
