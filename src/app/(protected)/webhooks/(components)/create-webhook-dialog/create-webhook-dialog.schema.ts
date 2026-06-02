import { z } from 'zod';

const IPV4_SEGMENT = '(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const IPV4_REGEX = new RegExp(`^${IPV4_SEGMENT}(\\.${IPV4_SEGMENT}){3}$`);
const CIDR_REGEX = new RegExp(`^${IPV4_SEGMENT}(\\.${IPV4_SEGMENT}){3}\\/(3[0-2]|[12]?\\d)$`);

const isIpOrCidr = (value: string) => IPV4_REGEX.test(value) || CIDR_REGEX.test(value);

export const createWebhookDialogSchema = z
  .object({
    label: z.string().trim().min(1, 'WEBHOOK_LABEL_REQUIRED').max(255, 'WEBHOOK_LABEL_TOO_LONG'),
    tokenExpirationHours: z.number().int().min(1, 'WEBHOOK_INVALID_TOKEN_EXPIRY'),
    ipAllowlist: z.array(z.object({ value: z.string().trim() })),
  })
  .superRefine((data, ctx) => {
    const dedupe = new Set<string>();

    data.ipAllowlist.forEach((entry, index) => {
      if (!entry.value) {
        return;
      }

      if (!isIpOrCidr(entry.value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ipAllowlist', index, 'value'],
          message: 'WEBHOOK_INVALID_ALLOWLIST_IP',
        });
      }

      if (dedupe.has(entry.value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ipAllowlist', index, 'value'],
          message: 'WEBHOOK_DUPLICATE_ALLOWLIST_IP',
        });
      }

      dedupe.add(entry.value);
    });
  });

export type CreateWebhookDialogFormData = z.infer<typeof createWebhookDialogSchema>;
