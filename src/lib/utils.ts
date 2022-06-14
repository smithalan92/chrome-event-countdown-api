import { WEATHER_CODES } from "./constants";

export function getWeatherIconNameForCode(code: number) {
  for (const [key, codes] of Object.entries(WEATHER_CODES)) {
    if (codes.includes(code)) return key;
  }

  return "cloudy";
}
