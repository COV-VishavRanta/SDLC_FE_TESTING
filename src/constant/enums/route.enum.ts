export enum ProtectedRoute {
  DASHBOARD = '/dashboard',
  USER_MANAGEMENT = '/user-management',
  PSP_MANAGEMENT = '/psp-management',
  BRAND_MANAGEMENT = '/brand-management',
  STORE_MANAGEMENT = '/store-management',
  CAMPAIGN_MANAGEMENT = '/campaign-management',
  SHIPMENTS = '/shipments',
  INVENTORY_MANAGEMENT = '/inventory-management',
  SURVEY_MANAGEMENT = '/survey-management',
  SURVEY_TEMPLATE = '/survey-management/template',
  CREATE_SURVEY_TEMPLATE = '/survey-management/template/create',
  EXCEPTION_REQUEST = '/exception-request',
  AUDIT_LOGS = '/audit-logs',
  ALERTS = '/alerts',
  REPORTS = '/reports',
  WEB_HOOKS = '/webhooks',
}

export enum AuthRoute {
  LOGIN = '/login',
}

export enum PublicRoute {
  ROOT = '/',
}
