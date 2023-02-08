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
  order: number;
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
  order: number;
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

export interface GetOrderDBResult extends RowDataPacket {
  order: number;
}

export interface DBNoteResult extends RowDataPacket {
  id: number;
  text: string;
}
