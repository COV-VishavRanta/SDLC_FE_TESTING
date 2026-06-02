'use client';

import { CapabilitiesGuard } from '@/components';
import { ProtectedRoute } from '@/constant';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_SURVEY_CAPABILITIES,
  SURVEY_CAPABILITIES_MAP,
} from '@/lib/permissions/route.permissions';
import type { ReactNode } from 'react';

export type SurveySubPage =
  | 'templates'
  | 'editSurvey'
  | 'previewSurvey'
  | 'assignBrand'
  | 'assignStore'
  | 'addResponse';

interface SurveyCapabilitiesGuardProps {
  children: ReactNode;
  subPage: SurveySubPage;
}

/**
 * Blocks access to survey management sub-pages for roles without the required capability.
 * Redirects to ProtectedRoute.SURVEY_MANAGEMENT on denial.
 *
 * Usage in any survey sub-page (server or client component):
 * ```tsx
 * export default async function EditSurveyPage({ params }) {
 *   return (
 *     <SurveyCapabilitiesGuard subPage='editSurvey'>
 *       <PageRoot>...</PageRoot>
 *     </SurveyCapabilitiesGuard>
 *   );
 * }
 * ```
 */
export function SurveyCapabilitiesGuard({ children, subPage }: SurveyCapabilitiesGuardProps) {
  const {
    canAccessTemplates,
    canAccessEditSurveyPage,
    canAccessPreviewSurveyPage,
    canAccessAssignBrandPage,
    canAccessAssignStorePage,
    canAccessAddResponsePage,
  } = useCapabilities(SURVEY_CAPABILITIES_MAP, DEFAULT_SURVEY_CAPABILITIES);

  const allowed = (() => {
    switch (subPage) {
      case 'templates':
        return canAccessTemplates;
      case 'editSurvey':
        return canAccessEditSurveyPage;
      case 'previewSurvey':
        return canAccessPreviewSurveyPage;
      case 'assignBrand':
        return canAccessAssignBrandPage;
      case 'assignStore':
        return canAccessAssignStorePage;
      case 'addResponse':
        return canAccessAddResponsePage;
      default:
        return false;
    }
  })();

  return (
    <CapabilitiesGuard allowed={allowed} fallbackRoute={ProtectedRoute.SURVEY_MANAGEMENT}>
      {children}
    </CapabilitiesGuard>
  );
}
