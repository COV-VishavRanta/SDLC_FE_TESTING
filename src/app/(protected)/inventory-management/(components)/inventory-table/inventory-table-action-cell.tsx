import {
  ActionButtonCell,
  ActionCellContainer,
  EditIcon,
  EyeIcon,
  InfoCircleIcon,
  InventoryDialog,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TrashIcon,
} from '@/components';
import { useCapabilities } from '@/hooks';
import {
  DEFAULT_INVENTORY_CAPABILITIES,
  INVENTORY_CAPABILITIES_MAP,
} from '@/lib/permissions/capabilities/inventory.capabilities';
import { InventoryType } from '@/types';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { DeleteInventoryDialog } from '../delete-inventory-dialog/delete-inventory-dialog';
import { ViewInventoryDialog } from '../view-inventory-dialog/view-inventory-dialog';

export type TranslateFn = ReturnType<typeof useTranslations<'inventoryManagement'>>;
/* ── Action Cell ── */
interface InventoryActionCellProps {
  row: { original: InventoryType };
  t: TranslateFn;
}

export function InventoryActionCell({ row, t }: InventoryActionCellProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const caps = useCapabilities(INVENTORY_CAPABILITIES_MAP, DEFAULT_INVENTORY_CAPABILITIES);

  const isInActiveCampaign = row.original.inActiveCampaign === true;

  return (
    <>
      <ActionCellContainer className='justify-end'>
        {/* View */}
        {caps.canViewInventory && (
          <ActionButtonCell
            icon={<EyeIcon className='size-[18px] text-primary' aria-hidden='true' />}
            tooltip={t('actions.viewItem')}
            onClick={() => setViewOpen(true)}
            className='hover:bg-stat-icon-blue'
          />
        )}

        {isInActiveCampaign ? (
          /* Info icon when inventory is locked to active campaigns */
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type='button'
                    aria-label={t('actions.activeCampaignReadOnly')}
                    className='flex size-[38px] cursor-default items-center justify-center rounded-lg hover:bg-muted'
                  >
                    <InfoCircleIcon
                      className='size-[18px] text-primary text-muted-foreground'
                      aria-hidden='true'
                    />
                  </button>
                }
              />
              <TooltipContent side='top'>
                <p>{t('actions.activeCampaignReadOnly')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            {/* Edit */}
            {caps.canEditInventory && (
              <ActionButtonCell
                icon={<EditIcon className='size-[18px] text-primary' aria-hidden='true' />}
                tooltip={t('actions.editItem')}
                onClick={() => setEditOpen(true)}
                className='hover:bg-stat-icon-blue'
              />
            )}

            {/* Delete */}
            {caps.canDeleteInventory && (
              <ActionButtonCell
                icon={<TrashIcon className='size-[18px] text-destructive' aria-hidden='true' />}
                tooltip={t('actions.deleteItem')}
                onClick={() => setDeleteOpen(true)}
                className='hover:bg-red-50'
              />
            )}
          </>
        )}
      </ActionCellContainer>

      {/* View Inventory Dialog */}
      {caps.canViewInventory && (
        <ViewInventoryDialog open={viewOpen} onOpenChange={setViewOpen} inventory={row.original} />
      )}

      {/* Delete Inventory Dialog */}
      {caps.canDeleteInventory && (
        <DeleteInventoryDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          inventoryId={row.original.id}
          inventoryName={row.original.name}
        />
      )}

      {/* Edit Inventory Dialog */}
      {caps.canEditInventory && editOpen && (
        <InventoryDialog
          mode='edit'
          initialData={row.original}
          quantityOnly={caps.canEditQuantityOnly}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
