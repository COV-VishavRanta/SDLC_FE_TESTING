'use client';

import { ROLE_TOPBAR_ENTITIES, TopbarEntity, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getRoleLabel } from '@/lib/utils';
import UserDialog from '../dialog/user-dialog/user-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';

/**
 * Skeleton fallback for the user profile dropdown while data loads
 */
export function UserProfileSkeleton() {
  return (
    <div className='flex items-center gap-3 pl-[13px]'>
      <div className='hidden flex-col items-end gap-1 md:flex'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-3 w-32' />
      </div>
      <Skeleton className='size-10 rounded-full' />
    </div>
  );
}

/**
 * Generates initials from a full name (e.g. "John Doe" → "JD")
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileDropdown() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const t = useTranslations('topbar.profile');
  const tEntities = useTranslations('topbar.entities');
  const tRoles = useTranslations('roles');
  const {
    currentUserData,
    isCurrentUserDataLoading,
    refetchCurrentUser,
    availablePsps,
    availableBrands,
    availableStores,
    selectedPspId,
    selectedBrandId,
    selectedStoreId,
  } = useGlobalProtected();
  const user = currentUserData?.me;
  const initials = getInitials(user?.name ?? '');

  const role = user?.roles?.[0]?.name as UserRole | undefined;
  const entitiesToShow = role ? (ROLE_TOPBAR_ENTITIES[role] ?? []) : [];

  const entityConfig: Record<TopbarEntity, { label: string; name: string | undefined }> = {
    [TopbarEntity.PSP]: {
      label: tEntities('psp'),
      name: availablePsps.find((o) => o.id === selectedPspId)?.name ?? availablePsps[0]?.name,
    },
    [TopbarEntity.BRAND]: {
      label: tEntities('brand'),
      name: availableBrands.find((o) => o.id === selectedBrandId)?.name ?? availableBrands[0]?.name,
    },
    [TopbarEntity.STORE]: {
      label: tEntities('store'),
      name: availableStores.find((o) => o.id === selectedStoreId)?.name ?? availableStores[0]?.name,
    },
  };

  const toggleEditDialog = () => {
    setIsEditOpen((prev) => !prev);
  };

  if (isCurrentUserDataLoading) {
    return <UserProfileSkeleton />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center gap-3 border-border pl-[13px] outline-none cursor-pointer focus-visible:ring-3 focus-visible:ring-[var(--focus-ring)] focus-visible:border-[var(--focus-border)] rounded-lg'>
          <div className='hidden flex-col items-end md:flex'>
            <p className='font-medium text-sm leading-[21px] text-gray-900 text-right'>
              {user?.name}
            </p>
            <p className='font-normal text-xs leading-[18px] text-muted-foreground text-right'>
              {user?.email}
            </p>
          </div>
          <div
            className='flex size-10 shrink-0 items-center justify-center rounded-full md:ml-2'
            style={{ background: 'var(--profile-badge)' }}
          >
            <span className='font-semibold text-sm leading-[21px] text-profile-badge-foreground'>
              {initials}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          className='w-56 bg-white border border-border rounded-xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] p-0 overflow-hidden'
        >
          <div className='px-4 py-3 border-b border-border'>
            <p className='font-semibold text-sm leading-[21px] text-gray-900'>{user?.name}</p>
            <p className='font-normal text-xs leading-[12px] sm:leading-[18px] break-all text-muted-foreground'>
              {user?.email}
            </p>
            <p className='font-normal text-xs leading-[18px] text-muted-foreground'>
              {user?.roles?.map((role) => getRoleLabel(role?.name, tRoles)).join(', ')}
            </p>
          </div>

          {/* Entity info — mobile only (desktop shows EntityDisplay in topbar) */}
          {entitiesToShow.length > 0 && (
            <div className='flex md:hidden items-center gap-4 px-4 py-3 border-b border-border'>
              {entitiesToShow.map((entity) => {
                const { label, name } = entityConfig[entity];
                if (!name) return null;
                return (
                  <div key={entity} className='flex flex-col'>
                    <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none mb-1'>
                      {label}
                    </span>
                    <span className='text-sm font-medium text-foreground leading-none'>{name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Profile Settings */}
          <DropdownMenuItem
            className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-sidebar-accent focus:bg-sidebar-accent rounded-none'
            onClick={toggleEditDialog}
          >
            <svg className='size-5 stroke-foreground' fill='none' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>
            <span className='text-sm leading-[21px] text-gray-900'>{t('profileSettings')}</span>
          </DropdownMenuItem>

          {/* Logout */}
          <DropdownMenuItem
            className='flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-sidebar-accent focus:bg-sidebar-accent rounded-none'
            render={<a href='/logout' />}
          >
            <svg className='size-5 stroke-destructive' fill='none' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
            <span className='text-sm leading-[21px] text-destructive'>{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Modal */}
      {isEditOpen && user && (
        <UserDialog
          mode='edit'
          onSubmit={() => refetchCurrentUser()}
          onClose={toggleEditDialog}
          initialData={{
            userId: user?.id,
            fullName: user?.name ?? '',
            email: user?.email,
            role: user?.roles?.[0]?.id ?? '',
            pspId: user?.psps?.[0]?.id ?? '',
            brandId: user?.brands?.[0]?.id ?? '',
            storeIds:
              user?.stores?.filter((store) => store.isActive).map((store) => store.id) ?? [],
            isPending: false,
          }}
          isDismissible
          selfEdit
          disabledFields={['email']}
          hiddenFields={['role', 'pspId', 'brandId', 'storeIds']}
        />
      )}
    </>
  );
}
