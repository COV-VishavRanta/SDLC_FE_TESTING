'use client';

import { InventoryDialog, PagePrimaryAction } from '@/components';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_INVENTORY_CAPABILITIES,
  INVENTORY_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/inventory.capabilities';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function CreateInventoryButton() {
  const t = useTranslations('inventoryManagement');
  const [open, setOpen] = useState(false);

  const caps = useCapabilities(INVENTORY_CAPABILITIES_MAP, DEFAULT_INVENTORY_CAPABILITIES);

  if (!caps.canCreateInventory) return null;

  return (
    <>
      <PagePrimaryAction className='px-6' onClick={() => setOpen(true)}>
        {t('filter.createButton')}
      </PagePrimaryAction>

      {open && <InventoryDialog mode='create' onClose={() => setOpen(false)} />}
    </>
  );
}
