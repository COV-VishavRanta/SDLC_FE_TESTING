'use client';

import { AlertTriangleIcon, CopyIcon, FieldLabel } from '@/components';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface WebhookCredentialsSectionProps {
  clientSecret: string;
}

export function WebhookCredentialsSection({ clientSecret }: WebhookCredentialsSectionProps) {
  const t = useTranslations('webhooks.dialog');

  const handleCopy = () => {
    navigator.clipboard
      .writeText(clientSecret)
      .then(() => {
        toast.success(t('credentials.copied'));
      })
      .catch(() => undefined);
  };

  return (
    <div className='rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-4'>
      {/* Warning row */}
      <div className='flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3'>
        <AlertTriangleIcon className='mt-0.5 size-5 shrink-0 text-amber-500' aria-hidden='true' />
        <p className='text-sm leading-relaxed text-amber-800'>{t('credentials.warning')}</p>
      </div>

      {/* Client Credentials */}
      <div className='flex flex-col gap-2'>
        <FieldLabel
          htmlFor='webhook-client-secret'
          className='flex items-center text-[var(--label-size)] font-[var(--font-weight-medium)] leading-[19.5px]'
          required
        >
          {t('credentials.title')}
        </FieldLabel>
        <div className='flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-3'>
          <span
            id='webhook-client-secret'
            className='flex-1 break-all font-mono text-sm text-text-heading'
            aria-label={t('credentials.title')}
          >
            {clientSecret}
          </span>
          <button
            type='button'
            onClick={handleCopy}
            aria-label={t('credentials.copyButton')}
            className='shrink-0 text-text-secondary transition-colors hover:text-text-heading cursor-pointer'
          >
            <CopyIcon className='size-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
