import { Request, ResponseToolkit } from "@hapi/hapi";
import WeatherApi from "../lib/WeatherApi";
import { ContainerCradle } from "../lib/types";
import AppRepository from "../repositories/AppRepository";

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
      return h.response().code(500);
    }
  }

  async getCitiesForCountry(req: Request, h: ResponseToolkit) {
    try {
      const results = await this.repository.getCitiesForCountry({
        countryId: req.params.countryId,
        searchTerm: req.query.searchTerm,
        offset: req.query.offset,
        limit: req.query.limit,
      });

      return {
        cities: results,
      };
    } catch (e) {
      console.log(e);
      return h.response().code(500);
    }
  }

  async getWeatherForCity(req: Request, h: ResponseToolkit) {
    const { lat, lng } = await this.repository.getCityCoordinates(req.params.cityId);
    const { current } = await this.weatherApi.getWeather({ lat, lng });
    const temperature = Number(current.temp_c).toFixed(0) + "°c";
    const temperatureFeel = Number(current.feelslike_c).toFixed(0) + "°c";

    return {
      summary: current.condition.text,
      icon: `https:${current.condition.icon}`,
      conditionCode: current.condition.code,
      isDay: current.is_day === 1,
      temp: temperature,
      tempFeel: temperatureFeel,
      windKph: current.wind_kph,
    };
  }
}

export default AppController;
