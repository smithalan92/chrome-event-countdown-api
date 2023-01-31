import * as awilix from "awilix";
import DBAgent from "./lib/DBAgent";
import WeatherApi from "./lib/WeatherApi";
import makePool from "./services/db";
import makeEnv from "./services/env";

export default async function configureContainer() {
  const container = awilix.createContainer();
  container.register("serviceName", awilix.asValue("Chrome Event Countdown API"));

  const env = makeEnv();
  container.register("env", awilix.asValue(env));

  const mysqlPool = makePool(container.cradle);
  const dbAgent = new DBAgent(mysqlPool);

  container.register("db", awilix.asValue(dbAgent));

  const weatherApi = new WeatherApi(container.cradle);
  container.register("weatherApi", awilix.asValue(weatherApi));

  return container;
}
