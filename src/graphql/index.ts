/**
 * GraphQL Operations
 *
 * This module exports all GraphQL fragments, queries, and mutations and there associated TypeScript types.
 * These operations are shared between:
 * - Server Components (via server query from @/lib/graphql)
 * - Client Components (via Apollo Client hooks)
 */

export * from './mutations/auth/auth.mutations';
export * from './mutations/auth/auth.types';
export * from './mutations/brand/brand.mutation';
export * from './mutations/brand/brand.types';
export * from './mutations/campaign/campaign.mutations';
export * from './mutations/campaign/campaign.types';
export * from './mutations/impersonation/impersonation.mutations';
export * from './mutations/impersonation/impersonation.types';
export * from './mutations/installation/installation.mutations';
export * from './mutations/installation/installation.types';
export * from './mutations/inventory/inventory.mutations';
export * from './mutations/inventory/inventory.types';
export * from './mutations/psp/psp.mutations';
export * from './mutations/psp/psp.types';
export * from './mutations/shipment/shipment.mutations';
export * from './mutations/shipment/shipment.types';
export * from './mutations/store/store.mutations';
export * from './mutations/store/store.types';
export * from './mutations/survey/survey.mutations';
export * from './mutations/survey/survey.types';
export * from './mutations/user/user.mutation';
export * from './mutations/user/user.types';
export * from './mutations/webhook/webhook.mutations';
export * from './mutations/webhook/webhook.types';

export * from './queries/audit-logs/audit-logs.queries';
export * from './queries/audit-logs/audit-logs.types';
export * from './queries/brand/brand.queries';
export * from './queries/brand/brand.types';
export * from './queries/campaign/campaign.queries';
export * from './queries/campaign/campaign.types';
export * from './queries/dashboard/dashboard.queries';
export * from './queries/dashboard/dashboard.types';
export * from './queries/impersonation/impersonation.queries';
export * from './queries/impersonation/impersonation.types';
export * from './queries/installation/installation.queries';
export * from './queries/installation/installation.types';
export * from './queries/inventory/inventory.queries';
export * from './queries/inventory/inventory.types';
export * from './queries/location/location.queries';
export * from './queries/location/location.types';
export * from './queries/media/media.queries';
export * from './queries/media/media.types';
export * from './queries/notifications/notifications.queries';
export * from './queries/notifications/notifications.types';
export * from './queries/psp/psp.queries';
export * from './queries/psp/psp.types';
export * from './queries/reports/reports.queries';
export * from './queries/reports/reports.types';
export * from './queries/shipment/shipment.queries';
export * from './queries/shipment/shipment.types';
export * from './queries/store/store.queries';
export * from './queries/store/store.types';
export * from './queries/survey/survey.queries';
export * from './queries/survey/survey.types';
export * from './queries/user/user.queries';
export * from './queries/user/user.types';
export * from './queries/webhook/webhook.queries';
export * from './queries/webhook/webhook.types';
