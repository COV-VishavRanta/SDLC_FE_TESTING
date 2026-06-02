'use client';

import { Button } from '@/components/ui/button';
import { UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { useTranslations } from 'next-intl';

/**
 * Derives the entity name to display in the impersonation banner
 * based on the impersonated user's role and the `me` query data.
 */
function useImpersonatedEntityName(): string | undefined {
  const { currentUserData } = useGlobalProtected();
  const me = currentUserData?.me;
  const role = me?.roles?.[0]?.name;

  if (!role || !me) return undefined;

  switch (role) {
    case UserRole.PSP_ADMIN:
      return me.psps?.[0]?.name;
    case UserRole.BRAND_ADMIN:
      return me.brands?.[0]?.name;
    case UserRole.STORE_ADMIN:
      return me.stores?.[0]?.name;
    default:
      return undefined;
  }
}

export function ImpersonationBanner() {
  const t = useTranslations('common.impersonation');
  const { isImpersonating, stopImpersonation, isImpersonationLoading, currentUserData } =
    useGlobalProtected();
  const entityName = useImpersonatedEntityName();

  if (!isImpersonating) return null;

  const roleName = currentUserData?.me?.roles?.[0]?.name ?? '';

  return (
    <div
      role='status'
      aria-live='polite'
      className='flex items-center justify-between bg-[#E6F4FA] px-4 py-2 text-sm text-[#3B424A] lg:px-8 fixed w-full top-0 z-[1000]'
    >
      <p>
        {t.rich('bannerMessage', {
          role: roleName,
          entity: entityName ?? '',
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <Button
        variant='default'
        size='sm'
        disabled={isImpersonationLoading}
        onClick={stopImpersonation}
        className='h-[37px] text-[14px] py-5'
      >
        {t('endButton')}
      </Button>
    </div>
  );
}
