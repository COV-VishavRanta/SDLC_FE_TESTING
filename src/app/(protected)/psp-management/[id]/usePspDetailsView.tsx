import {
  GET_COUNTRIES,
  GET_PSP_DETAILS,
  GET_STATES,
  GetCountriesResponse,
  GetPSPDetailsResponse,
  GetPSPDetailsVariables,
  GetStatesResponse,
  GetStatesVariables,
  UPDATE_PSP_STATUS,
  UpdatePSPStatusArguments,
  UpdatePSPStatusResponse,
} from '@/graphql';
import { CountryType, IncompleteCampaignType, StateType } from '@/types';
import { skipToken, useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function usePspDetailsView({ pspId }: { pspId: string }) {
  const tMessages = useTranslations('pspManagement.messages');
  const tDetails = useTranslations('pspManagement.details');
  const tActions = useTranslations('pspManagement.actions');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);

  const [updatePspStatusMutation, { loading: isUpdatingStatus }] = useMutation<
    UpdatePSPStatusResponse,
    UpdatePSPStatusArguments
  >(UPDATE_PSP_STATUS);

  /* Fetch PSP details and countries in parallel — neither depends on the other */
  const { data: pspData } = useSuspenseQuery<GetPSPDetailsResponse, GetPSPDetailsVariables>(
    GET_PSP_DETAILS,
    { variables: { id: pspId } },
  );
  const { data: countriesData } = useSuspenseQuery<GetCountriesResponse>(GET_COUNTRIES);

  const { psp } = pspData?.pspDetails ?? {};

  /* States depend on the resolved countryId — use skipToken so the query is skipped
     (not called with an empty string) until countryId is available */
  const { data: statesData } = useSuspenseQuery<GetStatesResponse, GetStatesVariables>(
    GET_STATES,
    psp?.countryId ? { variables: { countryId: psp.countryId } } : skipToken,
  );

  const countryName =
    countriesData?.countries?.find((c: CountryType) => c.id === psp?.countryId)?.name ??
    psp?.countryId ??
    '—';
  const stateName =
    statesData?.states?.find((s: StateType) => s.id === psp?.stateId)?.name ?? psp?.stateId ?? '—';

  const handleActivatePsp = async (id: string) => {
    await updatePspStatusMutation({
      variables: { input: { id, isActive: true } },
      onCompleted: () => toast.success(tMessages('success.activated')),
    });
  };

  const handleDeactivatePsp = async (id: string): Promise<IncompleteCampaignType[] | null> => {
    const result = await updatePspStatusMutation({
      variables: { input: { id, isActive: false } },
    });

    const payload = result.data?.updatePspStatus;

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
    handleActivatePsp,
    handleDeactivatePsp,
    isUpdatingStatus,
    isEditOpen,
    setIsEditOpen,
    isDeactivateOpen,
    setIsDeactivateOpen,
    isActivateOpen,
    setIsActivateOpen,

    // data
    psp,
    countryName,
    stateName,

    // Translations
    tDetails,
    tActions,
  } as const;
}
