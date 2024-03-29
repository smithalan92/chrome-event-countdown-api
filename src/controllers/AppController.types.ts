import { City, Country, DBNoteResult, ProcessedEvent } from "../repositories/AppRepository.types";

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

export interface GetAppDataResponse {
  events: ProcessedEvent[];
}

export interface AddEventBody {
  name: string;
  eventDate: string;
  background?: string;
  cityId: number;
}

export interface AddEventResponse {
  event: ProcessedEvent;
}

export interface UpdateEventParams {
  eventId: number;
}

export type UpdateEventBody = AddEventBody;
export type UpdateEventResponse = AddEventResponse;

export interface DeleteEventParams {
  eventId: number;
}

export interface ReorderEventsBody {
  eventIds: number[];
}

export interface ReorderEventsResponse {
  events: ProcessedEvent[];
}

export interface GetNotesResponse {
  notes: DBNoteResult[];
}

export interface AddNoteBody {
  text: string;
}

export interface AddNoteResponse {
  note: DBNoteResult;
}

export interface UpdateNoteParams {
  noteId: number;
}

export interface UpdateNoteBody {
  text: string;
}

export interface UpdateNoteResponse {
  note: DBNoteResult;
}

export interface DeleteNoteParams {
  noteId: number;
}
