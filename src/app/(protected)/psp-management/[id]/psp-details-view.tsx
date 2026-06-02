'use client';

import {
  AdminSectionCard,
  ArrowLeftIcon,
  Button,
  Card,
  CardContent,
  InfoField,
  PspDialog,
  StatusBadgeCell,
} from '@/components';
import Link from 'next/link';

import { ActivatePspDialog } from '../(components)/activate-deactivate-dialog/activate-psp-dialog';
import { DeactivatePspDialog } from '../(components)/activate-deactivate-dialog/deactivate-psp-dialog';
import usePspDetailsView from './usePspDetailsView';

interface PspDetailsViewProps {
  pspId: string;
}

export function PspDetailsView({ pspId }: PspDetailsViewProps) {
  const {
    handleActivatePsp,
    handleDeactivatePsp,
    isUpdatingStatus,
    isEditOpen,
    setIsEditOpen,
    isDeactivateOpen,
    setIsDeactivateOpen,
    isActivateOpen,
    setIsActivateOpen,
    psp,
    countryName,
    stateName,

    // Translations
    tDetails,
    tActions,
  } = usePspDetailsView({ pspId });

  return (
    <div className='flex min-w-0 flex-col gap-5 overflow-x-hidden bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'>
      {/* ── Back link ── */}
      <Link
        href='/psp-management'
        className='flex w-fit items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-[18px]' aria-hidden='true' />
        {tDetails('backLink')}
      </Link>

      {/* ── Page title row with action buttons ── */}
      <div className='flex items-start justify-between gap-4'>
        {/* PSP name + status badge */}
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
            {psp?.name}
          </h1>
          {psp && <StatusBadgeCell isActive={psp.isActive} />}
        </div>

        {/* Action buttons — only rendered once PSP data is available */}
        {psp && (
          <div className='flex shrink-0 gap-5'>
            {/* Edit PSP — only available for active PSPs (WCAG 4.1.2) */}
            {psp.isActive && (
              <Button
                variant='outline'
                onClick={() => setIsEditOpen(true)}
                className='h-11 rounded-lg border-[var(--primary-500)] px-6 text-[var(--primary-500)] hover:bg-[var(--primary-50)]'
              >
                {tActions('editPsp')}
              </Button>
            )}

            {/* Deactivate (active) / Activate (inactive) */}
            {psp.isActive ? (
              <Button
                variant='secondary'
                onClick={() => setIsDeactivateOpen(true)}
                className='h-11 rounded-lg from-[var(--neutral-500)] to-[var(--neutral-600)] px-6 hover:from-[var(--neutral-600)] hover:to-[var(--neutral-700)]'
              >
                {tActions('deactivatePsp')}
              </Button>
            ) : (
              <Button
                onClick={() => setIsActivateOpen(true)}
                className='h-11 rounded-lg bg-gradient-to-b from-[#10B981] to-[#059669] px-6 text-white hover:from-[#059669] hover:to-[#047857]'
              >
                {tActions('activatePsp')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Two-column card layout ── */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        {/* ── PSP Information card ── */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6 shadow-none'>
          {/* h2 for correct heading hierarchy under the h1 PSP name (WCAG 1.3.1) */}
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('pspInfo')}
          </h2>

          <CardContent className='grid grid-cols-1 gap-x-5 gap-y-5 !px-0 sm:grid-cols-2'>
            <InfoField label={tDetails('fields.pspName')} value={psp?.name} />
            <InfoField label={tDetails('fields.country')} value={countryName} />
            <InfoField label={tDetails('fields.state')} value={stateName} />
            <InfoField label={tDetails('fields.city')} value={psp?.cityName} />
            <InfoField label={tDetails('fields.address')} value={psp?.address} />
            <InfoField label={tDetails('fields.zipCode')} value={psp?.zipCode?.toString()} />
            <InfoField label={tDetails('fields.website')} value={psp?.website} />
          </CardContent>
        </Card>

        {/* ── PSP Personnel card ── */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6 shadow-none'>
          {/* h2 for correct heading hierarchy under the h1 PSP name (WCAG 1.3.1) */}
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('pspPersonnel')}
          </h2>

          <CardContent className='flex flex-col gap-5 !px-0'>
            {/* ── PSP Admins section ── */}

            <AdminSectionCard
              title={tDetails('pspAdminsSection')}
              activeAdmins={psp?.activePspAdmins ?? []}
              inactiveAdmins={psp?.inactivePspAdmins ?? []}
              pendingAdmins={psp?.pendingPspAdmins ?? []}
            />

            {/* ── Production Operators section ── */}
            <AdminSectionCard
              title={tDetails('productionOperatorsSection')}
              activeAdmins={psp?.activeProductionOperators ?? []}
              inactiveAdmins={psp?.inactiveProductionOperators ?? []}
              pendingAdmins={psp?.pendingProductionOperators ?? []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Edit PSP Dialog */}
      {isEditOpen && psp && (
        <PspDialog mode='edit' initialData={psp} onClose={() => setIsEditOpen(false)} />
      )}

      {/* Activate PSP Dialog */}
      {isActivateOpen && psp && (
        <ActivatePspDialog
          psp={psp}
          onClose={() => setIsActivateOpen(false)}
          handleActivatePsp={handleActivatePsp}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}

      {/* Deactivate PSP Dialog */}
      {isDeactivateOpen && psp && (
        <DeactivatePspDialog
          psp={psp}
          onClose={() => setIsDeactivateOpen(false)}
          handleDeactivatePsp={handleDeactivatePsp}
          isUpdatingStatus={isUpdatingStatus}
        />
      )}
    </div>
  );
}
