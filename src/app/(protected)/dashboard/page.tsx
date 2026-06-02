import { USER_ROLE_COOKIE_NAME, UserRole } from '@/constant';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import BrandAdminDashboard from './(brand-users-dashboard)/brand-admin-dashboard';
import CampaignAdminDashboard from './(brand-users-dashboard)/campaign-admin-dashboard';
import PlatformAdminDashboard from './(platform-users-dashboard)/platform-admin-dashboard';
import ProductionOperatorDashboard from './(psp-users-dashboard)/production-operator-dashboard';
import PspAdminDashboard from './(psp-users-dashboard)/psp-admin-dashboard';
import RegionalManagerDashboard from './(store-users-dashboard)/regional-manager-dashboard';
import StoreAdminDashboard from './(store-users-dashboard)/store-admin-dashboard';
import StoreOperatorDashboard from './(store-users-dashboard)/store-operator-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard — Pop Logic',
  description: 'Monitor system-wide metrics and manage platform operations',
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get(USER_ROLE_COOKIE_NAME)?.value ?? '';

  switch (role) {
    case UserRole.PLATFORM_ADMIN:
      return <PlatformAdminDashboard />;
    case UserRole.PSP_ADMIN:
      return <PspAdminDashboard />;
    case UserRole.BRAND_ADMIN:
      return <BrandAdminDashboard />;
    case UserRole.PRODUCTION_OPERATOR:
      return <ProductionOperatorDashboard />;
    case UserRole.CAMPAIGN_MANAGER:
      return <CampaignAdminDashboard />;
    case UserRole.REGIONAL_MANAGER:
      return <RegionalManagerDashboard />;
    case UserRole.STORE_ADMIN:
      return <StoreAdminDashboard />;
    case UserRole.STORE_OPERATOR:
      return <StoreOperatorDashboard />;

    default:
      return null;
  }
}
