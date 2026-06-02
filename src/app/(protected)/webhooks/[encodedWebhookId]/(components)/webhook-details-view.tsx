'use client';

import {
  ArrowLeftIcon,
  Button,
  Card,
  CardContent,
  CopyIcon,
  InfoCard,
  NoRecordFound,
  RefreshIcon,
  StatusBadgeCell,
  WebhookDialog,
} from '@/components';
import { ProtectedRoute } from '@/constant';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_WEBHOOK_CAPABILITIES,
  WEBHOOK_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/webhook.capabilities';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { toast } from 'sonner';

import useWebhookDetailsView from '../useWebhookDetailsView';
import { RotateSecretDialog } from './rotate-secret-dialog';

interface WebhookDetailsViewProps {
  credentialId: string;
}

const SINGLE_HOUR = 1;

export function WebhookDetailsView({ credentialId }: WebhookDetailsViewProps) {
  const locale = useLocale();
  const caps = useCapabilities(WEBHOOK_CAPABILITIES_MAP, DEFAULT_WEBHOOK_CAPABILITIES);

  const {
    credential,
    isEditOpen,
    setIsEditOpen,
    isRotateOpen,
    setIsRotateOpen,
    handleRotateSecret,
    handleRotateDialogClose,
    isRotating,
    rotatedSecret,
    refetchCredential,
    tDetails,
  } = useWebhookDetailsView({ credentialId });

  const formatDate = (value?: string | null) =>
    value
      ? new Date(value).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '-';

  const formatTokenExpiration = (hours?: number | null) => {
    if (!hours) return '�';
    const label = hours === SINGLE_HOUR ? tDetails('fields.hour') : tDetails('fields.hours');
    return `${hours} ${label}`;
  };

  const handleCopyClientId = () => {
    if (!credential?.clientId) return;
    navigator.clipboard
      .writeText(credential.clientId)
      .then(() => {
        toast.success(tDetails('copySuccess'));
      })
      .catch(() => undefined);
  };

  return (
    <div className='flex min-w-0 flex-col gap-5 overflow-x-hidden bg-[var(--neutral-200)] p-4 sm:p-6 lg:p-8'>
      {/* -- Back link -- */}
      <Link
        href={ProtectedRoute.WEB_HOOKS}
        className='flex w-fit items-center gap-2 text-[16px] font-[var(--font-weight-medium)] text-[var(--primary-400)] hover:underline'
      >
        <ArrowLeftIcon className='size-[18px]' aria-hidden='true' />
        {tDetails('backLink')}
      </Link>

      {/* -- Page title row -- */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-[28px] font-semibold leading-normal text-[var(--neutral-900)]'>
            {credential?.label}
          </h1>
          {credential && <StatusBadgeCell isActive={credential.isActive} />}
        </div>

        {credential?.isActive && caps.canEdit && (
          <Button
            variant='outline'
            onClick={() => {
              setIsEditOpen(true);
            }}
            className='h-11 shrink-0 rounded-lg border-[var(--primary-500)] px-6 text-[var(--primary-500)] hover:bg-[var(--primary-50)]'
          >
            {tDetails('actions.editCredential')}
          </Button>
        )}
      </div>

      {/* -- Two-column card layout -- */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]'>
        {/* -- Webhook Information card -- */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-transparent px-8 py-6 shadow-none'>
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('webhookInfo')}
          </h2>

          <CardContent className='flex flex-col gap-5 !px-0'>
            {/* Row 1: Name | Client ID (with copy) | Token Expiration */}
            <div className='grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-3'>
              <InfoCard label={tDetails('fields.name')} value={credential?.label} />

              {/* Client ID with copy button */}
              <InfoCard
                label={tDetails('fields.clientId')}
                value={
                  <span className='flex items-center gap-2'>
                    <span className='min-w-0 flex-1 truncate text-[16px] font-[var(--font-weight-regular)] leading-5 tracking-[-0.23px] text-[var(--text-heading)]'>
                      {credential?.clientId ?? '-'}
                    </span>
                    {credential?.clientId && (
                      <button
                        type='button'
                        onClick={handleCopyClientId}
                        aria-label={tDetails('copyButton')}
                        className='shrink-0 cursor-pointer text-text-secondary transition-colors hover:text-text-heading'
                      >
                        <CopyIcon className='size-4' />
                      </button>
                    )}
                  </span>
                }
              />

              <InfoCard
                label={tDetails('fields.tokenExpiration')}
                value={formatTokenExpiration(credential?.tokenExpirationHours)}
              />
            </div>

            {/* Row 2: Created At | Last Used At | Revoked At */}
            <div className='grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-3'>
              <InfoCard
                label={tDetails('fields.createdAt')}
                value={formatDate(credential?.createdAt)}
              />
              <InfoCard
                label={tDetails('fields.lastUsedAt')}
                value={formatDate(credential?.lastUsedAt)}
              />
              <InfoCard
                label={tDetails('fields.revokedAt')}
                value={formatDate(credential?.revokedAt)}
              />
            </div>

            {/* Row 3: Client Secret (full width) */}
            <InfoCard
              label={tDetails('fields.clientSecret')}
              value={
                <span className='flex items-center gap-3 rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-4 py-3'>
                  <span className='flex-1 font-mono text-[16px] leading-5 tracking-wide text-[var(--text-heading)]'>
                    {credential?.secretPrefix ? `${credential.secretPrefix}******` : '-'}
                  </span>
                  {credential?.isActive && caps.canRotateSecret && (
                    <button
                      type='button'
                      onClick={() => {
                        setIsRotateOpen(true);
                      }}
                      aria-label={tDetails('rotateDialog.rotateButton')}
                      className='shrink-0 cursor-pointer text-text-secondary transition-colors hover:text-primary'
                    >
                      <RefreshIcon className='size-[18px]' />
                    </button>
                  )}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* -- Allowed IPs card -- */}
        <Card className='gap-5 rounded-xl border border-[var(--neutral-300)] bg-white px-8 py-6 shadow-none'>
          <h2 className='text-[16px] font-[var(--font-weight-medium)] leading-5 tracking-[-0.15px] text-[var(--neutral-900)]'>
            {tDetails('allowedIps')}
          </h2>

          <CardContent className='flex flex-col gap-2 !px-0'>
            {!credential?.ipAllowlist?.length ? (
              <NoRecordFound message={tDetails('allIpsAllowed')} />
            ) : (
              <ul className='flex flex-col gap-2' aria-label={tDetails('allowedIps')}>
                {credential.ipAllowlist.map((ip, idx) => (
                  <li
                    key={idx}
                    className='rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-200)] px-4 py-3 font-mono text-[14px] text-[var(--text-heading)]'
                  >
                    {ip}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* -- Dialogs -- */}
      {isEditOpen && credential && (
        <WebhookDialog
          mode='edit'
          credential={credential}
          onClose={() => {
            setIsEditOpen(false);
          }}
          onSuccess={refetchCredential}
        />
      )}

      {isRotateOpen && (
        <RotateSecretDialog
          onClose={handleRotateDialogClose}
          onConfirm={handleRotateSecret}
          isRotating={isRotating}
          clientSecret={rotatedSecret}
        />
      )}
    </div>
  );
}
