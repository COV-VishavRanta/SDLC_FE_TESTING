import { UserRole } from '@/constant/enums/user.enums';

import { type CapabilitiesMap } from './capabilities';

/**
 * Section-level capabilities for the Webhook Management feature.
 * Controls which UI elements and actions are available per role.
 *
 * Adding a new role variant: add an entry to WEBHOOK_CAPABILITIES_MAP only.
 * No other files need to change.
 */
export interface WebhookCapabilities {
  // ── Webhook actions ──────────────────────────────────────────────────────────
  /** PSP Admin can create new webhook credentials. Platform Admin cannot. */
  canCreate: boolean;
  /** PSP Admin can edit webhook credentials. Platform Admin cannot. */
  canEdit: boolean;
  /** PSP Admin can rotate (regenerate) the webhook client secret. Platform Admin cannot. */
  canRotateSecret: boolean;

  // ── Table / filter visibility ────────────────────────────────────────────────
  /** Show the PSP column in the webhook table. Shown only for Platform Admin. */
  showPspColumn: boolean;
  /** Show the PSP filter dropdown before the status filter. Shown only for Platform Admin. */
  showPspFilter: boolean;
  /** Show the "Deactivate" action for active credentials. Shown only for roles that can edit credentials. */
  canDeactivate: boolean;
  /** Show the "Activate" action for inactive credentials. Shown only for roles that can edit credentials. */
  canActivate: boolean;
}

// ── Most restrictive defaults — unknown roles get no access ──────────────────

export const DEFAULT_WEBHOOK_CAPABILITIES: WebhookCapabilities = {
  canCreate: false,
  canEdit: false,
  canRotateSecret: false,
  showPspColumn: false,
  showPspFilter: false,
  canDeactivate: false,
  canActivate: false,
};

// ── Role-specific capabilities ────────────────────────────────────────────────

/** Platform Admin: read-only access; sees PSP column and filter to identify credential owners. */
const PLATFORM_ADMIN_WEBHOOK_CAPABILITIES: WebhookCapabilities = {
  canCreate: false,
  canEdit: false,
  canRotateSecret: false,
  showPspColumn: true,
  showPspFilter: true,
  canDeactivate: true,
  canActivate: true,
};

/** PSP Admin: full CRUD access scoped to their own PSP; no cross-PSP visibility needed. */
const PSP_ADMIN_WEBHOOK_CAPABILITIES: WebhookCapabilities = {
  canCreate: true,
  canEdit: true,
  canRotateSecret: true,
  showPspColumn: false,
  showPspFilter: false,
  canDeactivate: true,
  canActivate: true,
};

export const WEBHOOK_CAPABILITIES_MAP: CapabilitiesMap<WebhookCapabilities> = {
  [UserRole.PLATFORM_ADMIN]: PLATFORM_ADMIN_WEBHOOK_CAPABILITIES,
  [UserRole.PSP_ADMIN]: PSP_ADMIN_WEBHOOK_CAPABILITIES,
};
