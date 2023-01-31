import axios from "axios";
import { ContainerCradle } from "../container.types";
import { WeatherResponse } from "./WeatherApi.types";

class WeatherApi {
  apiToken: string;

  constructor({ env }: ContainerCradle) {
    this.apiToken = env.WEATHER_API_TOKEN;
  }

  async getWeather({ lat, lng }: { lat: number; lng: number }) {
    const { data } = await axios.get<WeatherResponse>(`http://api.weatherapi.com/v1/current.json`, {
      params: {
        key: this.apiToken,
        aqi: "yes",
        q: `${lat},${lng}`,
      },
    });

    return data;
  }
}

export default WeatherApi;
