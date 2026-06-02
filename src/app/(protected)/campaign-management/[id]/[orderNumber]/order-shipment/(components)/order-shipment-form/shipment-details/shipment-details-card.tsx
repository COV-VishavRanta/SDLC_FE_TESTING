'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormDatePickerField,
  FormInputField,
  FormTextareaField,
} from '@/components';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { OrderShipmentContext } from '../../../context/OrderShipmentContext';
import { ShipmentFormValues } from '../../../order-shipment.schema';

export function ShipmentDetailsCard() {
  const { register, errors, control } = useContext(OrderShipmentContext);
  const tDetails = useTranslations('campaignManagement.createShipment.shipmentDetails');

  return (
    <Card className='rounded-xl p-0'>
      <CardHeader className='px-8 pt-6 pb-0'>
        <CardTitle className='text-base font-semibold text-text-heading'>
          {tDetails('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-5 px-8 pt-5 pb-6'>
        <div className='grid grid-cols-2 gap-5 sm:grid-cols-2'>
          {/* Carrier Name */}
          <div className='flex flex-col gap-2'>
            <FormInputField<ShipmentFormValues>
              id='carrierName'
              label={tDetails('carrierNameRequired')}
              error={errors?.carrierName?.message}
              placeholder={tDetails('carrierNamePlaceholder')}
              register={register}
              required
            />
          </div>
          {/* Tracking Number */}
          <div className='flex flex-col gap-2'>
            <FormInputField<ShipmentFormValues>
              id='trackingNumber'
              label={tDetails('trackingNumberRequired')}
              error={errors?.trackingNumber?.message}
              placeholder={tDetails('trackingNumberPlaceholder')}
              register={register}
              required
            />
          </div>

          {/* Estimated Delivery Date */}
          <div className='flex flex-col gap-2'>
            <FormDatePickerField<ShipmentFormValues>
              placeholder={tDetails('pickDate')}
              id='eta'
              label={tDetails('estimatedDeliveryDate')}
              required
              error={errors?.eta?.message}
              control={control}
              disabledDates={{ before: new Date(new Date().setDate(new Date().getDate() + 1)) }}
            />
          </div>
        </div>

        {/* Shipment Notes */}
        <div className='flex flex-col gap-2'>
          <FormTextareaField<ShipmentFormValues>
            id='notes'
            label={tDetails('shipmentNotes')}
            error={errors?.notes?.message}
            placeholder={tDetails('shipmentNotesPlaceholder')}
            register={register}
          />
        </div>
      </CardContent>
    </Card>
  );
}
