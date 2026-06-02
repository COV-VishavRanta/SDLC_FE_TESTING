import {
  GET_BRAND_DETAILS,
  GET_COUNTRIES,
  GET_STATES,
  GetBrandDetailsResponse,
  GetBrandDetailsVariables,
  GetCountriesResponse,
  GetStatesResponse,
  GetStatesVariables,
  UPDATE_BRAND_STATUS,
  UpdateBrandStatusResponse,
  UpdateBrandStatusVariables,
} from '@/graphql';
import { CountryType, IncompleteCampaignType, StateType } from '@/types';
import { skipToken, useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useBrandDetailsView({ brandId }: { brandId: string }) {
  const tMessages = useTranslations('brandManagement.messages');

  const tDetails = useTranslations('brandManagement.details');
  const tActions = useTranslations('brandManagement.actions');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);

  const [updateBrandStatusMutation, { loading: isUpdatingStatus }] = useMutation<
    UpdateBrandStatusResponse,
    UpdateBrandStatusVariables
  >(UPDATE_BRAND_STATUS);

  /* Fetch Brand details and countries in parallel — neither depends on the other */
  const { data: brandData } = useSuspenseQuery<GetBrandDetailsResponse, GetBrandDetailsVariables>(
    GET_BRAND_DETAILS,
    { variables: { id: brandId } },
  );
  const { data: countriesData } = useSuspenseQuery<GetCountriesResponse>(GET_COUNTRIES);

  const { brand } = brandData?.brandDetails ?? {};

  /* States depend on the resolved countryId — use skipToken so the query is skipped
     (not called with an empty string) until countryId is available */
  const { data: statesData } = useSuspenseQuery<GetStatesResponse, GetStatesVariables>(
    GET_STATES,
    brand?.countryId ? { variables: { countryId: brand?.countryId } } : skipToken,
  );

  const countryName =
    countriesData?.countries?.find((c: CountryType) => c.id === brand?.countryId)?.name ??
    brand?.countryId ??
    '—';
  const stateName =
    statesData?.states?.find((s: StateType) => s.id === brand?.stateId)?.name ??
    brand?.stateId ??
    '—';

  const handleActivateBrand = async (id: string) => {
    await updateBrandStatusMutation({
      variables: { input: { id, isActive: true } },
      onCompleted: () => toast.success(tMessages('success.activated')),
    });
  };

  const handleDeactivateBrand = async (id: string): Promise<IncompleteCampaignType[] | null> => {
    const result = await updateBrandStatusMutation({
      variables: { input: { id, isActive: false } },
    });

    const payload = result.data?.updateBrandStatus;

    if (payload?.success === false && payload.incompleteCampaigns?.length) {
      return payload.incompleteCampaigns;
    }

    if (payload?.success) {
      toast.success(tMessages('success.deactivated'));
    }

    return null;
  };

  return {
    // status and edit modal
    handleActivateBrand,
    handleDeactivateBrand,
    isUpdatingStatus,
    isEditOpen,
    setIsEditOpen,
    isDeactivateOpen,
    setIsDeactivateOpen,
    isActivateOpen,
    setIsActivateOpen,

    // data
    brand,
    countryName,
    stateName,

    // Translations
    tDetails,
    tActions,
  } as const;
}
