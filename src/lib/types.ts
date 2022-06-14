import Hapi from "@hapi/hapi";
import { RowDataPacket, Connection } from "mysql2";
import AppController from "../controllers/AppController";
import AppRepository from "../repositories/AppRepository";
import AppRoutes from "../routes/AppRoutes";
import WeatherApi from "./WeatherApi";

export interface Env {
  MYSQL_HOST: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  WEATHER_API_TOKEN: string;
  serviceName: string;
  SERVER_PORT: number;
}

export interface ContainerCradle {
  env: Env;
  db: Connection;
  appController: AppController;
  appRoutes: AppRoutes;
  appRepository: AppRepository;
  weatherApi: WeatherApi;
}

export interface Router {
  configure: (server: Hapi.Server) => void;
}

export interface Country extends RowDataPacket {
  id: number;
  name: string;
}

export interface City extends RowDataPacket {
  id: number;
  name: string;
  timezoneName: string;
}

export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface CurrentWeather {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  air_quality: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    "us-epa-index": number;
    "gb-defra-index": number;
  };
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
}

export interface Coordinates extends RowDataPacket {
  latitude: number;
  longitude: number;
}
