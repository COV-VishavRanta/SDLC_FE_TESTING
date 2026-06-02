import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const WEBHOOK_NAME_MAX_LENGTH = 100;
const TOKEN_EXPIRATION_MIN = 1;

// Named limits for IP validation
const IPV4_OCTET_MAX = 255;
const IPV4_CIDR_MAX = 32;
const IPV6_CIDR_MAX = 128;

// ─────────────────────────────────────────────────────────────────────────────
// IP VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if value is a valid IPv4, IPv6, IPv4 CIDR, or IPv6 CIDR address.
 * Empty strings are treated as valid (the field is optional per-entry).
 */
export function isValidIpOrCidr(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed === '') return true;

  // IPv4 with optional CIDR prefix
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\/(\d{1,2}))?$/;
  if (ipv4Regex.test(trimmed)) {
    const slashIndex = trimmed.indexOf('/');
    const ipPart = slashIndex === -1 ? trimmed : trimmed.slice(0, slashIndex);
    const cidrPart = slashIndex === -1 ? undefined : trimmed.slice(slashIndex + 1);
    const octets = ipPart.split('.');
    const allOctetsValid = octets.every((o) => {
      const n = parseInt(o, 10);
      return n >= 0 && n <= IPV4_OCTET_MAX;
    });
    if (!allOctetsValid) return false;
    if (cidrPart !== undefined) {
      const prefix = parseInt(cidrPart, 10);
      return prefix >= 0 && prefix <= IPV4_CIDR_MAX;
    }
    return true;
  }

  // IPv6 — simplified check: must contain at least one colon
  if (trimmed.includes(':')) {
    const slashIndex = trimmed.indexOf('/');
    if (slashIndex !== -1) {
      const cidrPart = trimmed.slice(slashIndex + 1);
      const prefix = parseInt(cidrPart, 10);
      if (Number.isNaN(prefix) || prefix < 0 || prefix > IPV6_CIDR_MAX) return false;
    }
    // Basic IPv6 structure: only hex digits, colons, and optional /prefix
    const ipv6Part = slashIndex === -1 ? trimmed : trimmed.slice(0, slashIndex);
    return /^[0-9a-fA-F:]+$/.test(ipv6Part) && ipv6Part.includes(':');
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION MESSAGES INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

export interface WebhookValidationMessages {
  nameRequired: string;
  nameMaxLength: string;
  tokenRequired: string;
  tokenMin: string;
  tokenInteger: string;
  ipInvalid: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA FACTORY
// ─────────────────────────────────────────────────────────────────────────────

export const createWebhookDialogSchema = (messages: WebhookValidationMessages) =>
  z.object({
    webhookName: z
      .string()
      .min(1, messages.nameRequired)
      .max(WEBHOOK_NAME_MAX_LENGTH, messages.nameMaxLength),

    tokenExpirationHours: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z
        .number({
          error: messages.tokenRequired,
        })
        .int(messages.tokenInteger)
        .min(TOKEN_EXPIRATION_MIN, messages.tokenMin)
        .nullable()
        .refine((val) => val !== null, { message: messages.tokenRequired }),
    ),

    ipAllowlist: z
      .array(
        z.object({
          ip: z.string().refine((val) => isValidIpOrCidr(val), {
            message: messages.ipInvalid,
          }),
        }),
      )
      .optional(),
  });

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type WebhookFormData = z.infer<ReturnType<typeof createWebhookDialogSchema>>;
