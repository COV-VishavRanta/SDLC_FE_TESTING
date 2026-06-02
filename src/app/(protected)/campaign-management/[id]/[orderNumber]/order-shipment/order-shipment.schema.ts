import { VALIDATION_LENGTH } from '@/constant';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

export type SortDir = 'asc' | 'desc';

/* ─── Types ─── */
type ShipmentValidationT = ReturnType<
  typeof useTranslations<'campaignManagement.createShipment.shipmentDetails'>
>;

function getTodayStr(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/* ─── Schema Factory Function ─── */
export const createShipmentSchema = (t: ShipmentValidationT) =>
  z.object({
    trackingNumber: z
      .string()
      .min(VALIDATION_LENGTH.SHIPMENT.TRACKING_NUMBER.MIN, t('trackingNumberError'))
      .max(VALIDATION_LENGTH.SHIPMENT.TRACKING_NUMBER.MAX, t('trackingNumberMaxError')),
    carrierName: z
      .string()
      .min(VALIDATION_LENGTH.SHIPMENT.CARRIER_NAME.MIN, t('carrierNumberError'))
      .max(VALIDATION_LENGTH.SHIPMENT.CARRIER_NAME.MAX, t('carrierNameMaxError')),
    eta: z
      .string()
      .min(1, t('estimatedDeliveryDateRequiredError'))
      .refine((val) => val > getTodayStr(), t('estimatedDeliveryDateError')),
    notes: z.string().max(VALIDATION_LENGTH.SHIPMENT.NOTES.MAX, t('notesMaxError')).optional(),
  });

export type ShipmentFormValues = z.infer<ReturnType<typeof createShipmentSchema>>;
