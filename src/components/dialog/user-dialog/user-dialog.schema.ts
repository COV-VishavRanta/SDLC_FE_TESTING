import { NAME_REGEX, VALIDATION_LENGTH } from '@/constant';
import { z } from 'zod';

/* ─── Translated validation messages ─── */
export interface UserValidationMessages {
  fullNameRequired: string;
  fullNameMinLength: string;
  fullNameMaxLength: string;
  fullNameInvalid: string;
  emailRequired: string;
  emailInvalid: string;
  emailMaxLength: string;
  roleRequired: string;
  pspRequired: string;
  brandRequired: string;
  storeRequired: string;
}

/* ─── Schema requirements (driven by the creator's role + selected role) ─── */
export interface UserFormSchemaRequirements {
  /** pspId is required (Platform Admin assigning PSP Admin) */
  isPspRequired: boolean;
  /** brandId is required (PSP Admin assigning Brand Admin) */
  isBrandRequired: boolean;
  /** storeIds is required (Brand Admin assigning Regional Manager or Store Admin) */
  isStoreRequired: boolean;
}

/* ─── Schema factory ─── */
export const createUserDialogSchema = (
  requirements: UserFormSchemaRequirements,
  messages: UserValidationMessages,
) =>
  z
    .object({
      userId: z.string().optional(), // required for edit mode
      fullName: z
        .string()
        .min(1, messages.fullNameRequired)
        .min(VALIDATION_LENGTH.USER.FULL_NAME.MIN, messages.fullNameMinLength)
        .max(VALIDATION_LENGTH.USER.FULL_NAME.MAX, messages.fullNameMaxLength)
        .regex(NAME_REGEX, messages.fullNameInvalid),

      email: z
        .string()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid)
        .max(VALIDATION_LENGTH.CONTACT.EMAIL.MAX, messages.emailMaxLength)
        .toLowerCase(),

      role: z.string().min(1, messages.roleRequired),

      pspId: z.string().optional(),
      brandId: z.string().optional(),
      storeIds: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      if (requirements.isPspRequired && !data.pspId) {
        ctx.addIssue({
          code: 'invalid_type',
          message: messages.pspRequired,
          path: ['pspId'],
          expected: 'string',
          received: 'undefined',
        });
      }
      if (requirements.isBrandRequired && !data.brandId) {
        ctx.addIssue({
          code: 'invalid_type',
          message: messages.brandRequired,
          path: ['brandId'],
          expected: 'string',
          received: 'undefined',
        });
      }
      if (requirements.isStoreRequired && (!data.storeIds || data.storeIds.length === 0)) {
        ctx.addIssue({
          code: 'custom',
          message: messages.storeRequired,
          path: ['storeIds'],
        });
      }
    });

/* ─── Types ─── */
export type UserFormData = z.infer<ReturnType<typeof createUserDialogSchema>>;

/** @deprecated Use `createUserDialogSchema` instead */
export const userFormSchema = createUserDialogSchema;
