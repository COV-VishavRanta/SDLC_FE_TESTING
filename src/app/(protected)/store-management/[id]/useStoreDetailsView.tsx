import {
  GET_COUNTRIES,
  GET_STATES,
  GET_STORE_DETAILS,
  GetCountriesResponse,
  GetStatesResponse,
  GetStatesVariables,
  GetStoreDetailsResponse,
  GetStoreDetailsVariables,
  UPDATE_STORE_STATUS,
  UpdateStoreStatusResponse,
  UpdateStoreStatusVariables,
} from '@/graphql';
import { CountryType, IncompleteCampaignType, StateType } from '@/types';
import { skipToken, useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function useStoreDetailsView({ storeId }: { storeId: string }) {
  const tMessages = useTranslations('storeManagement.messages');
  const tDetails = useTranslations('storeManagement.details');
  const tActions = useTranslations('storeManagement.actions');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);

  const [updateStoreStatusMutation, { loading: isUpdatingStatus }] = useMutation<
    UpdateStoreStatusResponse,
    UpdateStoreStatusVariables
  >(UPDATE_STORE_STATUS);

  /* Fetch Store details and countries in parallel — neither depends on the other */
  const { data: storeData } = useSuspenseQuery<GetStoreDetailsResponse, GetStoreDetailsVariables>(
    GET_STORE_DETAILS,
    { variables: { id: storeId } },
  );
  const { data: countriesData } = useSuspenseQuery<GetCountriesResponse>(GET_COUNTRIES);

  const { store } = storeData?.storeDetails ?? {};

  /* States depend on the resolved countryId — use skipToken so the query is skipped
     (not called with an empty string) until countryId is available */
  const { data: statesData } = useSuspenseQuery<GetStatesResponse, GetStatesVariables>(
    GET_STATES,
    store?.countryId ? { variables: { countryId: store.countryId } } : skipToken,
  );

  const countryName =
    countriesData?.countries?.find((c: CountryType) => c.id === store?.countryId)?.name ??
    store?.countryId ??
    '—';
  const stateName =
    statesData?.states?.find((s: StateType) => s.id === store?.stateId)?.name ??
    store?.stateId ??
    '—';

  const handleActivateStore = async (id: string) => {
    await updateStoreStatusMutation({
      variables: { input: { id, isActive: true } },
      onCompleted: () => toast.success(tMessages('success.activated')),
    });
  };

  const handleDeactivateStore = async (id: string): Promise<IncompleteCampaignType[] | null> => {
    const result = await updateStoreStatusMutation({
      variables: { input: { id, isActive: false } },
    });

    const payload = result.data?.updateStoreStatus;
    const campaigns = payload?.incompleteCampaigns;

    if (payload?.success === false && campaigns?.length) {
      return campaigns;
    }

    if (payload?.success) {
      toast.success(tMessages('success.deactivated'));
    }

    return null;
  };

  return {
    // status and edit modal
    handleActivateStore,
    handleDeactivateStore,
    isUpdatingStatus,
    isEditOpen,
    setIsEditOpen,
    isDeactivateOpen,
    setIsDeactivateOpen,
    isActivateOpen,
    setIsActivateOpen,

    // data
    store,
    countryName,
    stateName,

    // Translations
    tDetails,
    tActions,
  } as const;
}
