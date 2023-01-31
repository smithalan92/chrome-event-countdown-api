import AppController from "./controllers/AppController";
import AuthController from "./controllers/AuthController";
import AppRepository from "./repositories/AppRepository";
import AuthRepository from "./repositories/AuthRepository";
import AppRoutes from "./routes/AppRoutes";
import WeatherApi from "./lib/WeatherApi";
import { Env } from "./services/env.types";
import DBAgent from "./lib/DBAgent";

export interface ContainerCradle {
  env: Env;
  db: DBAgent;
  appController: AppController;
  appRoutes: AppRoutes;
  appRepository: AppRepository;
  authController: AuthController;
  authRepository: AuthRepository;
  weatherApi: WeatherApi;
}
