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
