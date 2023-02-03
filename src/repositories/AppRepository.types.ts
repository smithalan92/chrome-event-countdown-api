import { RowDataPacket } from "mysql2";
import { GenericSearchQuery } from "../controllers/AppController.types";

export interface Country extends RowDataPacket {
  id: number;
  name: string;
}

export interface City extends RowDataPacket {
  id: number;
  name: string;
  timezoneName: string;
}

export interface Coordinates extends RowDataPacket {
  latitude: number;
  longitude: number;
}

export interface GetCitiesForCountryParams extends GenericSearchQuery {
  countryId: number;
}

export interface GetEventsForUserDBResponse extends RowDataPacket {
  id: number;
  name: string;
  dateTime: Date;
  background: string;
  cityId: number;
  cityName: string;
  timezoneName: string;
  countryId: number;
  countryName: string;
}

export interface ProcessedEvent {
  id: number;
  name: string;
  eventDate: Date;
  background: string;
  city: {
    id: number;
    name: string;
    timezoneName: string;
  };
  country: {
    id: number;
    name: string;
  };
}
