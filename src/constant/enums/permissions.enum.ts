/**
 * Page-level permission tokens.
 * Each entry maps to a guarded route section.
 */
export enum Permission {
  VIEW_USER_MANAGEMENT = 'view_user_management',
  VIEW_PSP_MANAGEMENT = 'view_psp_management',
  VIEW_BRAND_MANAGEMENT = 'view_brand_management',
  VIEW_CAMPAIGN_MANAGEMENT = 'view_campaign_management',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  VIEW_STORE_MANAGEMENT = 'view_store_management',
  VIEW_ALERTS = 'view_alerts',
  VIEW_SHIPMENTS = 'view_shipments',
  VIEW_INVENTORY_MANAGEMENT = 'view_inventory_management',
  VIEW_SURVEY_MANAGEMENT = 'view_survey_management',
  VIEW_EXCEPTION_REQUEST = 'view_exception_request',
  VIEW_REPORTS = 'view_reports',
  VIEW_WEB_HOOKS = 'view_web_hooks',
}
