import { FastifyInstance } from "fastify";
import { ContainerCradle } from "../container.types";
import AppController from "../controllers/AppController";
import {
  AddEventBody,
  AddEventResponse,
  AddNoteBody,
  AddNoteResponse,
  DeleteNoteParams,
  GenericSearchQuery,
  GetAppDataResponse,
  GetCitiesForCountryResponse,
  GetCountriesResponse,
  GetNotesResponse,
  GetWeatherForCityParams,
  GetWeatherForCityResponse,
  ReorderEventsBody,
  ReorderEventsResponse,
  UpdateEventBody,
  UpdateEventParams,
  UpdateEventResponse,
  UpdateNoteBody,
  UpdateNoteParams,
  UpdateNoteResponse,
} from "../controllers/AppController.types";
import makeAuthenticateUserMiddleware from "../middleware/authenticateUser";
import { GetCitiesForCountryParams } from "../repositories/AppRepository.types";
import { PossibleErrorResponse, Router } from "./routes.types";

class AppRoutes implements Router {
  controller: AppController;
  authUserMiddleware: ReturnType<typeof makeAuthenticateUserMiddleware>;

  constructor({ appController, authUserMiddleware }: ContainerCradle) {
    this.controller = appController;
    this.authUserMiddleware = authUserMiddleware;
  }

  configure(server: FastifyInstance) {
    server.route<{
      Querystring: GenericSearchQuery;
      Reply: PossibleErrorResponse<GetCountriesResponse>;
    }>({
      method: "GET",
      url: "/api/countries",
      handler: this.controller.getCountries,
    });

    server.route<{
      Querystring: GenericSearchQuery;
      Params: GetCitiesForCountryParams;
      Reply: PossibleErrorResponse<GetCitiesForCountryResponse>;
    }>({
      method: "GET",
      url: "/api/countries/:countryId/cities",
      handler: this.controller.getCitiesForCountry,
    });

    server.route<{
      Params: GetWeatherForCityParams;
      Reply: PossibleErrorResponse<GetWeatherForCityResponse>;
    }>({
      method: "GET",
      url: "/api/weather/:cityId",
      handler: this.controller.getWeatherForCity,
    });

    server.route<{
      Reply: PossibleErrorResponse<GetAppDataResponse>;
    }>({
      method: "GET",
      url: "/api/data",
      preHandler: this.authUserMiddleware,
      handler: this.controller.getAppData,
    });

    server.route<{
      Body: AddEventBody;
      Reply: PossibleErrorResponse<AddEventResponse>;
    }>({
      method: "POST",
      url: "/api/event",
      preHandler: this.authUserMiddleware,
      handler: this.controller.addEvent,
    });

    server.route<{
      Body: UpdateEventBody;
      Params: UpdateEventParams;
      Reply: PossibleErrorResponse<UpdateEventResponse>;
    }>({
      method: "PUT",
      url: "/api/event/:eventId",
      preHandler: this.authUserMiddleware,
      handler: this.controller.updateEvent,
    });

    server.route<{
      Params: UpdateEventParams;
      Reply: PossibleErrorResponse;
    }>({
      method: "DELETE",
      url: "/api/event/:eventId",
      preHandler: this.authUserMiddleware,
      handler: this.controller.deleteEvent,
    });

    server.route<{
      Body: ReorderEventsBody;
      Reply: PossibleErrorResponse<ReorderEventsResponse>;
    }>({
      method: "PUT",
      url: "/api/events/reorder",
      preHandler: this.authUserMiddleware,
      handler: this.controller.reorderEvents,
    });

    server.route<{
      Reply: PossibleErrorResponse<GetNotesResponse>;
    }>({
      method: "GET",
      url: "/api/notes",
      preHandler: this.authUserMiddleware,
      handler: this.controller.getNotes,
    });

    server.route<{
      Body: AddNoteBody;
      Reply: PossibleErrorResponse<AddNoteResponse>;
    }>({
      method: "POST",
      url: "/api/notes",
      preHandler: this.authUserMiddleware,
      handler: this.controller.addNote,
    });

    server.route<{
      Params: UpdateNoteParams;
      Body: UpdateNoteBody;
      Reply: PossibleErrorResponse<UpdateNoteResponse>;
    }>({
      method: "PUT",
      url: "/api/notes/:noteId",
      preHandler: this.authUserMiddleware,
      handler: this.controller.updateNote,
    });

    server.route<{
      Params: DeleteNoteParams;
      Reply: PossibleErrorResponse;
    }>({
      method: "DELETE",
      url: "/api/notes/:noteId",
      preHandler: this.authUserMiddleware,
      handler: this.controller.deleteNote,
    });
  }
}

export default AppRoutes;
