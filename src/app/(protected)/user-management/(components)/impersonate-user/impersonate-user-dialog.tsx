'use client';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
} from '@/components';
import { UserType } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useGlobalProtected } from '@/contexts';

/* ─── Types ─── */
interface ImpersonateUserDialogProps {
  user: Pick<UserType, 'id' | 'name' | 'email' | 'roles'>;
  onClose: () => void;
}

/* ─── Read-only field ─── */
function ReadOnlyField({
  label,
  value,
  icon,
  id,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  id: string;
}) {
  return (
    <Field className='flex flex-col gap-2'>
      {/* Use <label> with htmlFor for proper AT association (WCAG 3.3.2) */}
      <label htmlFor={id} className='text-[13px] font-medium leading-[19.5px] text-text-heading'>
        {label}
      </label>
      <div className='relative'>
        {icon && (
          <div className='pointer-events-none absolute left-4 top-[20px] -translate-y-1/2'>
            {icon}
          </div>
        )}
        <Input
          id={id}
          readOnly
          value={value}
          className={`flex items-center overflow-hidden rounded-lg border border-[#e5e7eb] bg-input-bg pr-4 ${icon ? 'pl-12' : 'px-4'} py-3`}
        />
      </div>
    </Field>
  );
}

/* ─── Impersonate User Dialog ─── */
export function ImpersonateUserDialog({ user, onClose }: ImpersonateUserDialogProps) {
  const t = useTranslations('userManagement.impersonateDialog');
  const { startImpersonation } = useGlobalProtected();
  const [isLoading, setIsLoading] = useState(false);

  const handleImpersonateUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await startImpersonation(userId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Dialog opened programmatically — no DialogTrigger needed (WCAG 2.1.1)
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden rounded-xl p-0 ring-0 sm:max-w-[600px]'
      >
        {/* ── Header ── */}
        <DialogHeader className='flex h-auto flex-row items-center justify-between sm:h-[104px]'>
          <div className='flex flex-col gap-1'>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </div>
          <DialogClose />
        </DialogHeader>

        {/* ── Body ── */}
        <div className='flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-5 pb-5 sm:px-8 sm:pt-6 sm:pb-6'>
          {/* aria-hidden on icons: decorative — label text conveys context (WCAG 1.1.1) */}
          <ReadOnlyField
            id='impersonate-full-name'
            label={t('fullNameLabel')}
            value={user.name ?? ''}
          />
          <ReadOnlyField id='impersonate-email' label={t('emailLabel')} value={user.email} />
          <ReadOnlyField
            id='impersonate-role'
            label={t('roleLabel')}
            value={user.roles?.[0]?.name ?? ''}
          />
        </div>

        {/* ── Footer ── */}
        <DialogFooter className='flex h-auto shrink-0 flex-col-reverse gap-3 px-5 py-3 sm:h-[88px] sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:pb-0 sm:pt-px'>
          <DialogClose
            render={
              <Button
                type='button'
                variant='outline'
                className='h-[47px] flex-1 rounded-lg border border-[#e5e7eb] bg-white text-[14px] leading-[21px] text-sm text-text-secondary sm:text-[16px]'
              >
                {t('cancelButton')}
              </Button>
            }
          />
          <Button
            type='button'
            variant='default'
            disabled={isLoading}
            onClick={() => handleImpersonateUser(user.id)}
            className='h-[45px] flex-1 rounded-lg bg-gradient-to-b text-[14px] font-medium leading-[21px] sm:text-[16px]'
          >
            {t('submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
