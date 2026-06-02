'use client';

import { useContext } from 'react';

import { ImportPromotionsContext } from '../../context/ImportPromotionsContext';

export default function DestinationCampaignName() {
  const { destinationCampaign } = useContext(ImportPromotionsContext);
  return <>{destinationCampaign?.name ?? '—'}</>;
}
