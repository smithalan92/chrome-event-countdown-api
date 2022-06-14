import * as awilix from "awilix";
import WeatherApi from "./lib/WeatherApi";
import makeDb from "./services/db";
import makeEnv from "./services/env";

export default async function configureContainer() {
  const container = awilix.createContainer();
  container.register("serviceName", awilix.asValue("Chrome Event Countdown API"));

  const env = makeEnv();
  container.register("env", awilix.asValue(env));

  const db = await makeDb(container.cradle);
  container.register("db", awilix.asValue(db));

  const weatherApi = new WeatherApi(container.cradle);
  container.register("weatherApi", awilix.asValue(weatherApi));

  return container;
}
