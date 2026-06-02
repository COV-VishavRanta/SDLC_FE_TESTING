import { UserRole } from '@/constant/enums/user.enums';

import { type CapabilitiesMap } from './capabilities';

/**
 * Section-level capabilities for the Survey Management feature.
 * Controls which UI elements, actions, and sub-routes are available per role.
 *
 * Adding a new role variant: add an entry to SURVEY_CAPABILITIES_MAP only.
 * No other files need to change.
 */
export interface SurveyCapabilities {
  // ── Survey-level actions ────────────────────────────────────────────────────
  canCreateSurvey: boolean;
  canEditSurvey: boolean;
  canDeleteSurvey: boolean;
  canPreviewSurvey: boolean;
  /** PSP Admin can assign a survey to brands. */
  canAssignToBrand: boolean;
  /** Brand Admin can assign a survey to stores. */
  canAssignToStore: boolean;
  /** Store Admin can view submitted responses for a survey. */
  canViewResponse: boolean;
  /** Store Admin can add a response to a survey. */
  canAddResponse: boolean;
  /** PSP Admin can close an active survey. */
  canCloseSurvey: boolean;

  /** Access to /survey-management/[id]  */
  canViewSurveyDetailsPage: boolean;

  // ── Template-level actions ──────────────────────────────────────────────────
  canCreateTemplate: boolean;
  canEditTemplate: boolean;
  canDeleteTemplate: boolean;
  canPreviewTemplate: boolean;

  // ── Sub-page access guards ──────────────────────────────────────────────────
  /** Access to /template/create, /template/[id]/edit, /template/[id]/preview */
  canAccessTemplates: boolean;
  canAccessAssignBrandPage: boolean;
  canAccessAssignStorePage: boolean;
  canAccessEditSurveyPage: boolean;
  canAccessPreviewSurveyPage: boolean;
  canAccessAddResponsePage: boolean;

  // ── Listing page configuration ──────────────────────────────────────────────
  /** Show the Templates / Surveys tab switcher (PSP Admin only). */
  showTabs: boolean;
  /** Show brand filter dropdown in the survey listing. */
  showBrandFilter: boolean;
  /** Show the "Create Survey" button. */
  showCreateSurveyButton: boolean;
  /** Show the "Create Template" button. */
  showCreateTemplateButton: boolean;
  /** Show the brand assigned column in the survey listing table. */
  showBrandAssignedColumn: boolean;
  /** Show the store assigned column in the survey listing table. */
  showStoreAssignedColumn: boolean;
  /** Show the response count column in the survey listing table. */
  showResponseCountColumn: boolean;
}

// ── Most restrictive defaults — unknown roles get no access ──────────────────

export const DEFAULT_SURVEY_CAPABILITIES: SurveyCapabilities = {
  canCreateSurvey: false,
  canEditSurvey: false,
  canDeleteSurvey: false,
  canPreviewSurvey: false,
  canAssignToBrand: false,
  canAssignToStore: false,
  canViewResponse: false,
  canAddResponse: false,
  canCloseSurvey: false,
  canViewSurveyDetailsPage: true,

  canCreateTemplate: false,
  canEditTemplate: false,
  canDeleteTemplate: false,
  canPreviewTemplate: false,

  canAccessTemplates: false,
  canAccessAssignBrandPage: false,
  canAccessAssignStorePage: false,
  canAccessEditSurveyPage: false,
  canAccessPreviewSurveyPage: false,
  canAccessAddResponsePage: false,

  showTabs: false,
  showBrandFilter: false,
  showCreateSurveyButton: false,
  showCreateTemplateButton: false,
  showBrandAssignedColumn: false,
  showStoreAssignedColumn: false,
  showResponseCountColumn: false,
};

// ── Role-specific capabilities ────────────────────────────────────────────────

/** PSP Admin: full access — templates + surveys + all actions */
const PSP_ADMIN_SURVEY_CAPABILITIES: SurveyCapabilities = {
  canCreateSurvey: true,
  canEditSurvey: true,
  canDeleteSurvey: true,
  canPreviewSurvey: true,
  canAssignToBrand: true,
  canAssignToStore: false,
  canViewResponse: false,
  canAddResponse: false,
  canCloseSurvey: true,
  canViewSurveyDetailsPage: true,

  canCreateTemplate: true,
  canEditTemplate: true,
  canDeleteTemplate: true,
  canPreviewTemplate: true,

  canAccessTemplates: true,
  canAccessAssignBrandPage: true,
  canAccessAssignStorePage: false,
  canAccessEditSurveyPage: true,
  canAccessPreviewSurveyPage: true,
  canAccessAddResponsePage: false,

  showTabs: true,
  showBrandFilter: true,
  showCreateSurveyButton: true,
  showCreateTemplateButton: true,
  showBrandAssignedColumn: true,
  showStoreAssignedColumn: false,
  showResponseCountColumn: true,
};

/** Brand Admin: surveys-only view, can preview and assign surveys to stores */
const BRAND_ADMIN_SURVEY_CAPABILITIES: SurveyCapabilities = {
  canCreateSurvey: false,
  canEditSurvey: false,
  canDeleteSurvey: false,
  canPreviewSurvey: true,
  canAssignToBrand: false,
  canAssignToStore: true,
  canViewResponse: false,
  canAddResponse: false,
  canCloseSurvey: false,
  canViewSurveyDetailsPage: true,

  canCreateTemplate: false,
  canEditTemplate: false,
  canDeleteTemplate: false,
  canPreviewTemplate: false,

  canAccessTemplates: false,
  canAccessAssignBrandPage: false,
  canAccessAssignStorePage: true,
  canAccessEditSurveyPage: false,
  canAccessPreviewSurveyPage: true,
  canAccessAddResponsePage: false,

  showTabs: false,
  showBrandFilter: false,
  showCreateSurveyButton: false,
  showCreateTemplateButton: false,
  showBrandAssignedColumn: false,
  showStoreAssignedColumn: true,
  showResponseCountColumn: true,
};

const REGIONAL_MANAGER_SURVEY_CAPABILITIES: SurveyCapabilities = {
  canCreateSurvey: false,
  canEditSurvey: false,
  canDeleteSurvey: false,
  canPreviewSurvey: true,
  canAssignToBrand: false,
  canAssignToStore: false,
  canViewResponse: false,
  canAddResponse: false,
  canCloseSurvey: false,
  canViewSurveyDetailsPage: true,

  canCreateTemplate: false,
  canEditTemplate: false,
  canDeleteTemplate: false,
  canPreviewTemplate: false,

  canAccessTemplates: false,
  canAccessAssignBrandPage: false,
  canAccessAssignStorePage: false,
  canAccessEditSurveyPage: false,
  canAccessPreviewSurveyPage: true,
  canAccessAddResponsePage: false,

  showTabs: false,
  showBrandFilter: false,
  showCreateSurveyButton: false,
  showCreateTemplateButton: false,
  showBrandAssignedColumn: false,
  showStoreAssignedColumn: true,
  showResponseCountColumn: true,
};

/** Store Admin: surveys-only view, can view and add responses */
const STORE_ADMIN_SURVEY_CAPABILITIES: SurveyCapabilities = {
  canCreateSurvey: false,
  canEditSurvey: false,
  canDeleteSurvey: false,
  canPreviewSurvey: false,
  canAssignToBrand: false,
  canAssignToStore: false,
  canViewResponse: true,
  canAddResponse: true,
  canCloseSurvey: false,
  canViewSurveyDetailsPage: false,

  canCreateTemplate: false,
  canEditTemplate: false,
  canDeleteTemplate: false,
  canPreviewTemplate: false,

  canAccessTemplates: false,
  canAccessAssignBrandPage: false,
  canAccessAssignStorePage: false,
  canAccessEditSurveyPage: false,
  canAccessPreviewSurveyPage: false,
  canAccessAddResponsePage: true,

  showTabs: false,
  showBrandFilter: false,
  showCreateSurveyButton: false,
  showCreateTemplateButton: false,
  showBrandAssignedColumn: false,
  showStoreAssignedColumn: false,
  showResponseCountColumn: false,
};

/** Store Operator: surveys-only view, can view and add responses */
const STORE_OPERATOR_SURVEY_CAPABILITIES: SurveyCapabilities = {
  canCreateSurvey: false,
  canEditSurvey: false,
  canDeleteSurvey: false,
  canPreviewSurvey: false,
  canAssignToBrand: false,
  canAssignToStore: false,
  canViewResponse: true,
  canAddResponse: true,
  canCloseSurvey: false,
  canViewSurveyDetailsPage: false,

  canCreateTemplate: false,
  canEditTemplate: false,
  canDeleteTemplate: false,
  canPreviewTemplate: false,

  canAccessTemplates: false,
  canAccessAssignBrandPage: false,
  canAccessAssignStorePage: false,
  canAccessEditSurveyPage: false,
  canAccessPreviewSurveyPage: false,
  canAccessAddResponsePage: true,

  showTabs: false,
  showBrandFilter: false,
  showCreateSurveyButton: false,
  showCreateTemplateButton: false,
  showBrandAssignedColumn: false,
  showStoreAssignedColumn: false,
  showResponseCountColumn: false,
};

export const SURVEY_CAPABILITIES_MAP: CapabilitiesMap<SurveyCapabilities> = {
  [UserRole.PSP_ADMIN]: PSP_ADMIN_SURVEY_CAPABILITIES,
  [UserRole.BRAND_ADMIN]: BRAND_ADMIN_SURVEY_CAPABILITIES,
  [UserRole.STORE_ADMIN]: STORE_ADMIN_SURVEY_CAPABILITIES,
  [UserRole.STORE_OPERATOR]: STORE_OPERATOR_SURVEY_CAPABILITIES,
  [UserRole.REGIONAL_MANAGER]: REGIONAL_MANAGER_SURVEY_CAPABILITIES,
};
