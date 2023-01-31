import WeatherApi from "../lib/WeatherApi";
import AppRepository from "../repositories/AppRepository";
import { getWeatherIconNameForCode } from "../lib/utils";
import {
  PossibleErrorResponse,
  RouteHandler,
  RouteHandlerWithQueryString,
  RouteHandlerWithQueryStringAndParams,
  RouterHandlerWithParams,
} from "../routes/routes.types";
import {
  GenericSearchQuery,
  GetCitiesForCountryParams,
  GetCitiesForCountryResponse,
  GetCountriesResponse,
  GetWeatherForCityParams,
  GetWeatherForCityResponse,
} from "./AppController.types";
import { ContainerCradle } from "../container.types";

class AppController {
  repository: AppRepository;
  weatherApi: WeatherApi;

  constructor({ appRepository, weatherApi }: ContainerCradle) {
    this.repository = appRepository;
    this.weatherApi = weatherApi;
  }

  getCountries: RouteHandlerWithQueryString<GenericSearchQuery, PossibleErrorResponse<GetCountriesResponse>> = async (
    req,
    reply
  ) => {
    try {
      const results = await this.repository.getCountries({
        searchTerm: req.query.searchTerm,
        offset: req.query.offset,
        limit: req.query.limit,
      });

      return reply.code(200).send({
        countries: results,
      });
    } catch (e) {
      console.log(e);
      return reply.code(500).send({ error: "Error occured, try again" });
    }
  };

  getCitiesForCountry: RouteHandlerWithQueryStringAndParams<
    GenericSearchQuery,
    GetCitiesForCountryParams,
    PossibleErrorResponse<GetCitiesForCountryResponse>
  > = async (req, reply) => {
    try {
      const results = await this.repository.getCitiesForCountry({
        countryId: req.params.countryId,
        searchTerm: req.query.searchTerm,
        offset: req.query.offset,
        limit: req.query.limit,
      });

      return reply.send({
        cities: results,
      });
    } catch (e: any) {
      console.log(e);
      return reply.code(500).send({ error: e.message });
    }
  };

  getWeatherForCity: RouterHandlerWithParams<
    GetWeatherForCityParams,
    PossibleErrorResponse<GetWeatherForCityResponse>
  > = async (req, reply) => {
    try {
      const { lat, lng } = await this.repository.getCityCoordinates(req.params.cityId);
      const { current } = await this.weatherApi.getWeather({ lat, lng });
      const temperature = Number(current.temp_c).toFixed(0) + "°c";
      const temperatureFeel = Number(current.feelslike_c).toFixed(0) + "°c";

      return reply.send({
        summary: current.condition.text,
        icon: getWeatherIconNameForCode(current.condition.code),
        isDay: current.is_day === 1,
        temp: temperature,
        tempFeel: temperatureFeel,
        windKph: current.wind_kph,
      });
    } catch (e: any) {
      console.log(e);
      return reply.code(500).send({ error: e.message });
    }
  };
}

export default AppController;
