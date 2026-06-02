import { AuthValidationCode } from '@/constant';
import { z } from 'zod';

/**
 * Login form validation schema
 * Uses translation keys as error messages, which are translated in the component
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, AuthValidationCode.EMAIL_REQUIRED)
    .email(AuthValidationCode.EMAIL_INVALID),
});

/**
 * Inferred TypeScript type from LoginSchema
 */
export type LoginFormData = z.infer<typeof LoginSchema>;
