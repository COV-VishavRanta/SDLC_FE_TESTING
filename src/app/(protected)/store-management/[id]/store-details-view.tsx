'use client';

import {
  AdminSectionCard,
  ArrowLeftIcon,
  Button,
  Card,
  CardContent,
  InfoField,
  StatusBadgeCell,
  StoreDialog,
} from '@/components';
import Link from 'next/link';

import { ProtectedRoute } from '@/constant';
import { ActivateStoreDialog } from '../(components)/activate-deactivate-dialog/activate-store-dialog';
import { DeactivateStoreDialog } from '../(components)/activate-deactivate-dialog/deactivate-store-dialog';
import useStoreDetailsView from './useStoreDetailsView';

interface StoreDetailsViewProps {
  storeId: string;
}

export function StoreDetailsView({ storeId }: StoreDetailsViewProps) {
  const {
    handleActivateStore,
    handleDeactivateStore,
    isUpdatingStatus,
    isEditOpen,
    setIsEditOpen,
    isDeactivateOpen,
    setIsDeactivateOpen,
    isActivateOpen,
    setIsActivateOpen,
    store,
    countryName,
    stateName,

    // Translations
    tDetails,
    tActions,
  } = useStoreDetailsView({ storeId });

  return (
    <div className='flex min-w-0 flex-col gap-5 overflow-x-hidden bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'>
      {/* ── Back link ── */}
      <Link
        href={ProtectedRoute.STORE_MANAGEMENT}
        className='flex w-fit items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-[18px]' aria-hidden='true' />
        {tDetails('backLink')}
      </Link>

      {/* ── Page title row with action buttons ── */}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
        {/* Store name + status badge */}
        <div className='flex w-full flex-wrap items-center gap-3'>
          <h1 className='w-full text-[28px] font-semibold leading-normal text-[var(--neutral-900)] sm:w-auto'>
            {store?.name}
          </h1>
          {store && <StatusBadgeCell isActive={store.isActive} />}
        </div>

        {/* Action buttons — only rendered once store data is available */}
        {store && (
          <div className='flex w-full gap-3 sm:w-auto sm:shrink-0 sm:gap-5'>
            {/* Edit Store — only available for active stores (WCAG 4.1.2) */}
            {store.isActive && (
              <Button
                variant='outline'
                onClick={() => setIsEditOpen(true)}
                className='h-11 flex-1 rounded-lg border-[var(--primary-500)] px-6 text-[var(--primary-500)] hover:bg-[var(--primary-50)] sm:flex-none'
              >
                {tActions('editStore')}
              </Button>
            )}

            {/* Deactivate (active) / Activate (inactive) */}
            {store.isActive ? (
              <Button
                variant='secondary'
                onClick={() => setIsDeactivateOpen(true)}
                className='h-11 flex-1 rounded-lg from-[var(--neutral-500)] to-[var(--neutral-600)] px-6 hover:from-[var(--neutral-600)] hover:to-[var(--neutral-700)] sm:flex-none'
              >
                {tActions('deactivateStore')}
              </Button>
            ) : (
              <Button
                onClick={() => setIsActivateOpen(true)}
                className='h-11 flex-1 rounded-lg bg-gradient-to-b from-[#10B981] to-[#059669] px-6 text-white hover:from-[#059669] hover:to-[#047857] sm:flex-none'
              >
                {tActions('activateStore')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Two-column card layout ── */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {/* ── Store Information card ── */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-4 py-5 shadow-none sm:px-8 sm:py-6'>
          {/* h2 for correct heading hierarchy under the h1 Store name (WCAG 1.3.1) */}
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('storeInfo')}
          </h2>

          <CardContent className='grid grid-cols-1 gap-x-5 gap-y-5 !px-0 sm:grid-cols-2'>
            <InfoField label={tDetails('fields.storeName')} value={store?.name} />
            <InfoField label={tDetails('fields.storeNumber')} value={store?.storeNumber} />
            <InfoField label={tDetails('fields.phoneNumber')} value={store?.phoneNumber} />
            <InfoField label={tDetails('fields.country')} value={countryName} />
            <InfoField label={tDetails('fields.state')} value={stateName} />
            <InfoField label={tDetails('fields.city')} value={store?.cityName} />
            <InfoField label={tDetails('fields.address')} value={store?.address} />
            <InfoField label={tDetails('fields.zipCode')} value={store?.zipCode?.toString()} />
          </CardContent>
        </Card>

        {/* ── Store Personnel card ── */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-4 py-5 shadow-none sm:px-8 sm:py-6'>
          {/* h2 for correct heading hierarchy under the h1 Store name (WCAG 1.3.1) */}
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('storePersonnel')}
          </h2>

          <CardContent className='flex flex-col gap-5 !px-0'>
            {/* ── Store Admins section ── */}
            <AdminSectionCard
              title={tDetails('storeAdminsSection')}
              activeAdmins={store?.activeStoreAdmins ?? []}
              inactiveAdmins={store?.inactiveStoreAdmins ?? []}
              pendingAdmins={store?.pendingStoreAdmins ?? []}
            />

            {/* ── Store Operators section ── */}
            <AdminSectionCard
              title={tDetails('storeOperatorsSection')}
              activeAdmins={store?.activeStoreOperators ?? []}
              inactiveAdmins={store?.inactiveStoreOperators ?? []}
              pendingAdmins={store?.pendingStoreOperators ?? []}
            />

            {/* ── Regional Managers section ── */}
            <AdminSectionCard
              title={tDetails('regionalManagersSection')}
              activeAdmins={store?.activeRegionalManagers ?? []}
              inactiveAdmins={store?.inactiveRegionalManagers ?? []}
              pendingAdmins={store?.pendingRegionalManagers ?? []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit Store Dialog */}
      {isEditOpen && store && (
        <StoreDialog mode='edit' initialData={store} onClose={() => setIsEditOpen(false)} />
      )}

      {/* Activate Store Dialog */}
      {isActivateOpen && store && (
        <ActivateStoreDialog
          store={store}
          onClose={() => setIsActivateOpen(false)}
          handleActivateStore={handleActivateStore}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}

      {/* Deactivate Store Dialog */}
      {isDeactivateOpen && store && (
        <DeactivateStoreDialog
          store={store}
          onClose={() => setIsDeactivateOpen(false)}
          handleDeactivateStore={handleDeactivateStore}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </div>
  );
}
