import { City, Country } from "../repositories/AppRepository.types";

export interface GenericSearchQuery {
  searchTerm?: string;
  offset?: number;
  limit?: number;
}

export interface GetCountriesResponse {
  countries: Country[];
}

export interface GetCitiesForCountryParams {
  countryId: number;
}

export interface GetCitiesForCountryResponse {
  cities: City[];
}

export interface GetWeatherForCityParams {
  cityId: number;
}

export interface GetWeatherForCityResponse {
  summary: string;
  icon: string;
  isDay: boolean;
  temp: string;
  tempFeel: string;
  windKph: number;
}
