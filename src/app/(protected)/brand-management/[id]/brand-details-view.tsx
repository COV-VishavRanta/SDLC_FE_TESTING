'use client';

import {
  AdminSectionCard,
  ArrowLeftIcon,
  BrandDialog,
  Button,
  Card,
  CardContent,
  InfoField,
  StatusBadgeCell,
} from '@/components';
import Link from 'next/link';

import { ProtectedRoute } from '@/constant';
import { ActivateBrandDialog } from '../(components)/activate-deactivate-dialog/activate-brand-dialog';
import { DeactivateBrandDialog } from '../(components)/activate-deactivate-dialog/deactivate-brand-dialog';
import useBrandDetailsView from './useBrandDetailsView';

interface BrandDetailsViewProps {
  brandId: string;
}

export function BrandDetailsView({ brandId }: BrandDetailsViewProps) {
  const {
    handleActivateBrand,
    handleDeactivateBrand,
    isUpdatingStatus,
    isEditOpen,
    setIsEditOpen,
    isDeactivateOpen,
    setIsDeactivateOpen,
    isActivateOpen,
    setIsActivateOpen,
    brand,
    countryName,
    stateName,

    // Translations
    tDetails,
    tActions,
  } = useBrandDetailsView({ brandId });

  return (
    <div className='flex min-w-0 flex-col gap-5 overflow-x-hidden bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'>
      {/* ── Back link ── */}
      <Link
        href={ProtectedRoute.BRAND_MANAGEMENT}
        className='flex w-fit items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-[18px]' aria-hidden='true' />
        {tDetails('backLink')}
      </Link>

      {/* ── Page title row with action buttons ── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
        {/* Brand name + status badge */}
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
            {brand?.name}
          </h1>
          {brand && <StatusBadgeCell isActive={brand.isActive} />}
        </div>

        {/* Action buttons — only rendered once brand data is available */}
        {brand && (
          <div className='flex shrink-0 flex-wrap gap-3 sm:gap-5'>
            {/* Edit Brand — only available for active brands (WCAG 4.1.2) */}
            {brand.isActive && (
              <Button
                variant='outline'
                onClick={() => setIsEditOpen(true)}
                className='h-11 rounded-lg border-[var(--primary-500)] px-6 text-[var(--primary-500)] hover:bg-[var(--primary-50)]'
              >
                {tActions('editBrand')}
              </Button>
            )}

            {/* Deactivate (active) / Activate (inactive) */}
            {brand.isActive ? (
              <Button
                variant='secondary'
                onClick={() => setIsDeactivateOpen(true)}
                className='h-11 rounded-lg from-[var(--neutral-500)] to-[var(--neutral-600)] px-6 hover:from-[var(--neutral-600)] hover:to-[var(--neutral-700)]'
              >
                {tActions('deactivateBrand')}
              </Button>
            ) : (
              <Button
                onClick={() => setIsActivateOpen(true)}
                className='h-11 rounded-lg bg-gradient-to-b from-[#10B981] to-[#059669] px-6 text-white hover:from-[#059669] hover:to-[#047857]'
              >
                {tActions('activateBrand')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Two-column card layout ── */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {/* ── Brand Information card ── */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6 shadow-none'>
          {/* h2 for correct heading hierarchy under the h1 Brand name (WCAG 1.3.1) */}
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('brandInfo')}
          </h2>

          <CardContent className='grid grid-cols-1 gap-x-5 gap-y-5 !px-0 sm:grid-cols-2'>
            <InfoField label={tDetails('fields.brandName')} value={brand?.name} />
            <InfoField label={tDetails('fields.country')} value={countryName} />
            <InfoField label={tDetails('fields.state')} value={stateName} />
            <InfoField label={tDetails('fields.city')} value={brand?.cityName} />
            <InfoField label={tDetails('fields.address')} value={brand?.address} />
            <InfoField label={tDetails('fields.zipCode')} value={brand?.zipCode?.toString()} />
            <InfoField label={tDetails('fields.website')} value={brand?.website} />
          </CardContent>
        </Card>

        {/* ── Brand Personnel card ── */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6 shadow-none'>
          {/* h2 for correct heading hierarchy under the h1 Brand name (WCAG 1.3.1) */}
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('brandPersonnel')}
          </h2>

          <CardContent className='flex flex-col gap-5 !px-0'>
            {/* ── Brand Admins section ── */}
            <AdminSectionCard
              title={tDetails('brandAdminsSection')}
              activeAdmins={brand?.activeBrandAdmins ?? []}
              inactiveAdmins={brand?.inactiveBrandAdmins ?? []}
              pendingAdmins={brand?.pendingBrandAdmins ?? []}
            />

            {/* ── Campaign Managers section ── */}
            <AdminSectionCard
              title={tDetails('campaignManagersSection')}
              activeAdmins={brand?.activeCampaignManagers ?? []}
              inactiveAdmins={brand?.inactiveCampaignManagers ?? []}
              pendingAdmins={brand?.pendingCampaignManagers ?? []}
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Dialogs ── */}
      {isEditOpen && brand && (
        <BrandDialog
          mode='edit'
          initialData={{
            id: brand.id,
            name: brand.name,
            countryId: brand.countryId ?? undefined,
            stateId: brand.stateId ?? undefined,
            cityName: brand.cityName ?? undefined,
            streetAddress: brand.address ?? undefined,
            website: brand.website ?? undefined,
            zipCode: brand.zipCode ?? undefined,
          }}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {isDeactivateOpen && brand && (
        <DeactivateBrandDialog
          brand={brand}
          onClose={() => setIsDeactivateOpen(false)}
          handleDeactivateBrand={handleDeactivateBrand}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}

      {isActivateOpen && brand && (
        <ActivateBrandDialog
          brand={brand}
          onClose={() => setIsActivateOpen(false)}
          handleActivateBrand={handleActivateBrand}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </div>
  );
}
