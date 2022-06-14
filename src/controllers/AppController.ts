import { Request, ResponseToolkit } from "@hapi/hapi";
import DarkSkyApi from "../lib/DarkSkyApi";
import { ContainerCradle } from "../lib/types";
import AppRepository from "../repositories/AppRepository";

class AppController {
  repository: AppRepository;
  darkSkyApi: DarkSkyApi;

  constructor({ appRepository, darkSkyApi }: ContainerCradle) {
    this.repository = appRepository;
    this.darkSkyApi = darkSkyApi;
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
      return h.response().code(500);
    }
  }

  async getWeatherForCity(req: Request, h: ResponseToolkit) {
    const { lat, lng } = await this.repository.getCityCoordinates(req.params.cityId);
    const { currently } = await this.darkSkyApi.getWeather({ lat, lng });
    const rainChance = currently.precipProbability * 100 + "%";
    const temperature = Number(currently.temperature).toFixed(0) + "°c";

    return {
      summary: currently.summary,
      icon: currently.icon,
      temp: temperature,
      chanceOfRain: rainChance,
    };
  }
}

export default AppController;
