'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { ROLE_TOPBAR_ENTITIES, TopbarEntity, UserRole } from '@/constant';
import { useGlobalProtected } from '@/contexts';
import { useTranslations } from 'next-intl';

export default function EntityDisplay() {
  const {
    currentUserData,
    availablePsps,
    availableBrands,
    availableStores,
    selectedPspId,
    selectedBrandId,
    selectedStoreId,
    switchEntity,
  } = useGlobalProtected();
  const t = useTranslations('topbar.entities');
  const me = currentUserData?.me;

  if (!me) return null;

  const role = me.roles?.[0]?.name as UserRole | undefined;
  if (!role) return null;

  const entitiesToShow = ROLE_TOPBAR_ENTITIES[role] ?? [];
  if (entitiesToShow.length === 0) return null;

  const entityConfig: Record<
    TopbarEntity,
    { options: { id: string; name: string }[]; selectedId: string | undefined }
  > = {
    [TopbarEntity.PSP]: { options: availablePsps, selectedId: selectedPspId },
    [TopbarEntity.BRAND]: { options: availableBrands, selectedId: selectedBrandId },
    [TopbarEntity.STORE]: { options: availableStores, selectedId: selectedStoreId },
  };

  return (
    <div className='flex items-center border-l border-border pl-6 ml-2 gap-6'>
      {entitiesToShow.map((entity) => {
        const { options, selectedId } = entityConfig[entity];
        const label = t(entity.toLowerCase() as 'psp' | 'brand' | 'store');
        const selectedName = options.find((o) => o.id === selectedId)?.name ?? options[0]?.name;

        if (options.length <= 1) {
          return (
            <div key={entity} className='flex flex-col justify-center h-10'>
              <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none mb-1'>
                {label}
              </span>
              <span className='text-sm font-medium text-foreground leading-none'>
                {selectedName}
              </span>
            </div>
          );
        }

        return (
          <div key={entity} className='flex flex-col justify-center'>
            <span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none mb-1'>
              {label}
            </span>
            <Select
              aria-label={label}
              value={selectedId ?? options[0]?.id}
              onValueChange={(newId) => {
                if (newId) switchEntity(entity, newId as string);
              }}
              itemToStringLabel={(id: string) => options.find((o) => o.id === id)?.name ?? ''}
            >
              <SelectTrigger
                aria-label={label}
                size='sm'
                className='h-auto border-none bg-transparent shadow-none px-0 text-sm font-medium text-foreground gap-1 min-w-[80px] max-w-[180px]'
              >
                <SelectValue placeholder={selectedName} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
