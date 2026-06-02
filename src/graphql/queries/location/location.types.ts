import { CountryType, StateType } from '@/types/graphql.types';

/*
-----------------COUNTRIES-----------------
*/

export interface GetCountriesResponse {
  countries: CountryType[];
}

/*
-----------------STATES-----------------
*/

export interface GetStatesVariables {
  countryId: string;
}

export interface GetStatesResponse {
  states: StateType[];
}
