'use client';

import {
  PageFilters,
  PageResetButton,
  PageSearch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { UserStatusEnum } from '@/constant';
import { cn, getRoleLabel } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { UserManagementContext } from '../../context/UserManagementContext';

interface UserFiltersProps {
  className?: string;
}

export function UserFilters({ className }: UserFiltersProps) {
  const t = useTranslations('userManagement');
  const tRoles = useTranslations('roles');
  const {
    // Filters
    filterState,
    updateSearch,
    clearSearch,
    updateStatus,
    updateRole,
    updatePsp,
    pspList,
    updateBrand,
    brandList,
    updateStore,
    storeList,
    resetFilters,

    // Permissions
    isPlatformAdmin,
    isPspAdmin,
    isBrandAdmin,
    assignableRoles,

    // Constants for "All" options in filters
    ALL_PSPS,
    ALL_ROLES,
    ALL_BRANDS,
    ALL_STORES,
    ALL_STATUSES,
  } = useContext(UserManagementContext);

  const sortedAssignableRoles = [...(assignableRoles ?? [])].sort((a, b) =>
    getRoleLabel(a.name, tRoles).localeCompare(getRoleLabel(b.name, tRoles)),
  );

  const sortedPspList = [...(pspList ?? [])].sort((a, b) => a.name.localeCompare(b.name));
  const sortedBrandList = [...(brandList ?? [])].sort((a, b) => a.name.localeCompare(b.name));
  const sortedStoreList = [...(storeList ?? [])].sort((a, b) => a.name.localeCompare(b.name));

  const statusOptions = [
    { label: t('statusOptions.all'), value: ALL_STATUSES },
    { label: t('statusOptions.active'), value: UserStatusEnum.ACTIVE },
    { label: t('statusOptions.inactive'), value: UserStatusEnum.INACTIVE },
    { label: t('statusOptions.pending'), value: UserStatusEnum.PENDING },
  ];

  return (
    <PageFilters className={cn(className)}>
      {/* Search and Filter Toggle */}
      <div className='flex flex-wrap gap-3 items-center wide:flex-nowrap'>
        <PageSearch
          placeholder={t('filter.searchPlaceholder')}
          value={filterState.search}
          onChange={(e) => {
            updateSearch(e.target.value);
          }}
          onClear={clearSearch}
          inputClassName='bg-input-bg border-border text-[14px] tracking-[-0.1504px] placeholder:text-input-placeholder'
        />

        {/* PSP Filter - Platform Admin only */}
        {isPlatformAdmin && (
          <div className='w-full wide:min-w-[150px] wide:w-auto'>
            <Select
              value={filterState.pspId}
              aria-label='PSP Filter'
              onValueChange={(value) => updatePsp(value ?? ALL_PSPS)}
              itemToStringLabel={(selectedItem: string) =>
                selectedItem === ALL_PSPS
                  ? t('filter.allPsps')
                  : (sortedPspList.find((psp) => psp.id === selectedItem)?.name ?? '')
              }
            >
              <SelectTrigger
                aria-label='PSP Filter'
                className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
              >
                <SelectValue placeholder={t('filter.pspPlaceholder')} />
              </SelectTrigger>
              <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
                <SelectItem value={ALL_PSPS} className='text-[14px] tracking-[-0.1504px]'>
                  {t('filter.allPsps')}
                </SelectItem>
                {sortedPspList.map((psp) => (
                  <SelectItem
                    key={psp.id}
                    value={psp.id}
                    className='text-[14px] tracking-[-0.1504px]'
                  >
                    {psp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Brand Filter - PSP Admin only */}
        {isPspAdmin && (
          <div className='w-full wide:min-w-[150px] wide:w-auto'>
            <Select
              aria-label='Brand Filter'
              value={filterState.brandId}
              onValueChange={(value) => updateBrand(value ?? ALL_BRANDS)}
              itemToStringLabel={(selectedItem: string) =>
                selectedItem === ALL_BRANDS
                  ? t('filter.allBrands')
                  : (sortedBrandList.find((brand) => brand.id === selectedItem)?.name ?? '')
              }
            >
              <SelectTrigger
                aria-label='Brand Filter'
                className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
              >
                <SelectValue placeholder={t('filter.brandPlaceholder')} />
              </SelectTrigger>
              <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
                <SelectItem value={ALL_BRANDS} className='text-[14px] tracking-[-0.1504px]'>
                  {t('filter.allBrands')}
                </SelectItem>
                {sortedBrandList.map((brand) => (
                  <SelectItem
                    key={brand.id}
                    value={brand.id}
                    className='text-[14px] tracking-[-0.1504px]'
                  >
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Store Filter - Brand Admin only */}
        {isBrandAdmin && (
          <div className='w-full wide:min-w-[150px] wide:w-auto'>
            <Select
              aria-label='Store Filter'
              value={filterState.storeId}
              onValueChange={(value) => updateStore(value ?? ALL_STORES)}
              itemToStringLabel={(selectedItem: string) =>
                selectedItem === ALL_STORES
                  ? t('filter.allStores')
                  : (sortedStoreList.find((store) => store.id === selectedItem)?.name ?? '')
              }
            >
              <SelectTrigger
                aria-label='Store Filter'
                className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
              >
                <SelectValue placeholder={t('filter.storePlaceholder')} />
              </SelectTrigger>
              <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
                <SelectItem value={ALL_STORES} className='text-[14px] tracking-[-0.1504px]'>
                  {t('filter.allStores')}
                </SelectItem>
                {sortedStoreList.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={store.id}
                    className='text-[14px] tracking-[-0.1504px]'
                  >
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Role Filter */}
        <div className='w-full wide:min-w-[200px] wide:w-auto'>
          <Select
            aria-label='Role Filter'
            value={filterState.roleId}
            onValueChange={(value) => updateRole(value ?? ALL_ROLES)}
            itemToStringLabel={(selectedItem: string) =>
              selectedItem === ALL_ROLES
                ? t('filter.allRoles')
                : getRoleLabel(
                    sortedAssignableRoles.find((role) => role.id === selectedItem)?.name ?? '',
                    tRoles,
                  )
            }
          >
            <SelectTrigger
              aria-label='Role Filter'
              className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
            >
              <SelectValue placeholder={t('filter.rolePlaceholder')} />
            </SelectTrigger>
            <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
              <SelectItem value={ALL_ROLES} className='text-[14px] tracking-[-0.1504px]'>
                {t('filter.allRoles')}
              </SelectItem>
              {sortedAssignableRoles.map((role) => (
                <SelectItem
                  key={role.id}
                  value={role.id}
                  className='text-[14px] tracking-[-0.1504px]'
                >
                  {getRoleLabel(role.name, tRoles)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className='w-full wide:min-w-[150px] wide:w-auto'>
          <Select
            aria-label='Status Filter'
            value={filterState.status}
            onValueChange={(value) => updateStatus(value ?? ALL_STATUSES)}
            itemToStringLabel={(selectedItem: string) =>
              statusOptions.find((item) => item.value === selectedItem)?.label ?? ''
            }
          >
            <SelectTrigger
              aria-label='Status Filter'
              className='h-[40.5px] bg-input-bg text-[13px] font-medium focus-visible:border-[var(--focus-border)] focus-visible:ring-[var(--focus-ring)] focus-visible:ring-3'
            >
              <SelectValue placeholder={t('statusOptions.all')} />
            </SelectTrigger>
            <SelectContent className='rounded-[8px]' alignItemWithTrigger={false}>
              {statusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='text-[14px] tracking-[-0.1504px]'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PageResetButton onClick={resetFilters} />
      </div>
    </PageFilters>
  );
}
