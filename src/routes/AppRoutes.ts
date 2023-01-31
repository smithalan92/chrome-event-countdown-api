import { FastifyInstance } from "fastify";
import { ContainerCradle } from "../container.types";
import AppController from "../controllers/AppController";
import {
  GenericSearchQuery,
  GetCitiesForCountryResponse,
  GetCountriesResponse,
  GetWeatherForCityParams,
  GetWeatherForCityResponse,
} from "../controllers/AppController.types";
import { GetCitiesForCountryParams } from "../repositories/AppRepository.types";
import { PossibleErrorResponse, Router } from "./routes.types";

class AppRoutes implements Router {
  controller: AppController;

  constructor({ appController }: ContainerCradle) {
    this.controller = appController;
  }

  configure(server: FastifyInstance) {
    server.route<{
      Querystring: GenericSearchQuery;
      Reply: PossibleErrorResponse<GetCountriesResponse>;
    }>({
      method: "GET",
      url: "/api/countries",
      handler: this.controller.getCountries,
    });

    server.route<{
      Querystring: GenericSearchQuery;
      Params: GetCitiesForCountryParams;
      Reply: PossibleErrorResponse<GetCitiesForCountryResponse>;
    }>({
      method: "GET",
      url: "/api/countries/:countryId/cities",
      handler: this.controller.getCitiesForCountry,
    });

    server.route<{
      Params: GetWeatherForCityParams;
      Reply: PossibleErrorResponse<GetWeatherForCityResponse>;
    }>({
      method: "GET",
      url: "/api/weather/:cityId",
      handler: this.controller.getWeatherForCity,
    });
  }
}

export default AppRoutes;
