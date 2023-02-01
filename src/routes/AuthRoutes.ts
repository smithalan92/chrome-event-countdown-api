import { FastifyInstance } from "fastify";
import { ContainerCradle } from "../container.types";
import AuthController from "../controllers/AuthController";
import { LoginRequest, LoginResponse } from "../controllers/AuthController.types";
import { PossibleErrorResponse, Router } from "./routes.types";

class AuthRoutes implements Router {
  controller: AuthController;

  constructor({ authController }: ContainerCradle) {
    this.controller = authController;
  }

  configure(server: FastifyInstance) {
    server.route<{
      Body: LoginRequest;
      Reply: PossibleErrorResponse<LoginResponse>;
    }>({
      method: "POST",
      url: "/api/login",
      handler: this.controller.login,
    });
  }
}

export default AuthRoutes;
