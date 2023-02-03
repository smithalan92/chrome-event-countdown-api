import WeatherApi from "../lib/WeatherApi";
import AppRepository from "../repositories/AppRepository";
import { getWeatherIconNameForCode } from "../lib/utils";
import {
  PossibleErrorResponse,
  RouteHandler,
  RouteHandlerWithBody,
  RouteHandlerWithBodyAndParams,
  RouteHandlerWithQueryString,
  RouteHandlerWithQueryStringAndParams,
  RouterHandlerWithParams,
} from "../routes/routes.types";
import {
  AddEventBody,
  AddEventResponse,
  DeleteEventParams,
  GenericSearchQuery,
  GetAppDataResponse,
  GetCitiesForCountryParams,
  GetCitiesForCountryResponse,
  GetCountriesResponse,
  GetWeatherForCityParams,
  GetWeatherForCityResponse,
  UpdateEventBody,
  UpdateEventParams,
  UpdateEventResponse,
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

      reply.code(200).send({
        countries: results,
      });
    } catch (e) {
      console.log(e);
      reply.code(500).send({ error: "Error occured, try again" });
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

      reply.code(200).send({
        cities: results,
      });
    } catch (e: any) {
      console.log(e);
      reply.code(500).send({ error: e.message });
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

      reply.code(200).send({
        summary: current.condition.text,
        icon: getWeatherIconNameForCode(current.condition.code),
        isDay: current.is_day === 1,
        temp: temperature,
        tempFeel: temperatureFeel,
        windKph: current.wind_kph,
      });
    } catch (e: any) {
      console.log(e);
      reply.code(500).send({ error: e.message });
    }
  };

  getAppData: RouteHandler<PossibleErrorResponse<GetAppDataResponse>> = async (req, reply) => {
    const userId: number = req.requestContext.get("userId");
    const events = await this.repository.getEventsForUser(userId);

    reply.code(200).send({ events });
  };

  addEvent: RouteHandlerWithBody<AddEventBody, PossibleErrorResponse<AddEventResponse>> = async (req, reply) => {
    const userId: number = req.requestContext.get("userId");
    const data = req.body;

    const newEventId = await this.repository.addEvent(userId, data);

    const event = await this.repository.getEvent(userId, newEventId);

    reply.code(200).send({ event });
  };

  updateEvent: RouteHandlerWithBodyAndParams<
    UpdateEventParams,
    UpdateEventBody,
    PossibleErrorResponse<UpdateEventResponse>
  > = async (req, reply) => {
    const userId: number = req.requestContext.get("userId");
    const { eventId } = req.params;
    const data = req.body;

    await this.repository.updateEvent(userId, eventId, data);

    const event = await this.repository.getEvent(userId, eventId);

    reply.code(200).send({ event });
  };

  deleteEvent: RouterHandlerWithParams<DeleteEventParams, PossibleErrorResponse> = async (req, reply) => {
    const userId: number = req.requestContext.get("userId");
    const { eventId } = req.params;

    await this.repository.deleteEvent({ userId, eventId });

    reply.code(201).send();
  };
}

export default AppController;
