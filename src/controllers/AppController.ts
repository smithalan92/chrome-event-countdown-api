import { Request, ResponseToolkit } from "@hapi/hapi";
import WeatherApi from "../lib/WeatherApi";
import { ContainerCradle } from "../lib/types";
import AppRepository from "../repositories/AppRepository";
import { getWeatherIconNameForCode } from "../lib/utils";

class AppController {
  repository: AppRepository;
  weatherApi: WeatherApi;

  constructor({ appRepository, weatherApi }: ContainerCradle) {
    this.repository = appRepository;
    this.weatherApi = weatherApi;
  }

  async getCountries(req: Request, h: ResponseToolkit) {
    try {
      const results = await this.repository.getCountries({
        searchTerm: req.query.searchTerm,
        offset: req.query.offset,
        limit: req.query.limit,
      });

      return {
        countries: results,
      };
    } catch (e) {
      console.log(e);
      return h.response({ error: e }).code(500);
    }
  }

  async getCitiesForCountry(req: Request, h: ResponseToolkit) {
    try {
      const results = await this.repository.getCitiesForCountry({
        countryId: parseInt(req.params.countryId),
        searchTerm: req.query.searchTerm,
        offset: parseInt(req.query.offset, 10),
        limit: parseInt(req.query.limit, 10),
      });

      return {
        cities: results,
      };
    } catch (e) {
      console.log(e);
      return h.response({ error: e }).code(500);
    }
  }

  async getWeatherForCity(req: Request, h: ResponseToolkit) {
    try {
      const { lat, lng } = await this.repository.getCityCoordinates(req.params.cityId);
      const { current } = await this.weatherApi.getWeather({ lat, lng });
      const temperature = Number(current.temp_c).toFixed(0) + "°c";
      const temperatureFeel = Number(current.feelslike_c).toFixed(0) + "°c";

      return {
        summary: current.condition.text,
        icon: getWeatherIconNameForCode(current.condition.code),
        isDay: current.is_day === 1,
        temp: temperature,
        tempFeel: temperatureFeel,
        windKph: current.wind_kph,
      };
    } catch (e) {
      console.log(e);
      return h.response({ error: e }).code(500);
    }
  }
}

export default AppController;
