import { FastifyInstance } from "fastify";
import { ContainerCradle } from "../container.types";
import AuthController from "../controllers/AuthController";
import { Router } from "./routes.types";

class AuthRoutes implements Router {
  controller: AuthController;

  constructor({ authController }: ContainerCradle) {
    this.controller = authController;
  }

  configure(server: FastifyInstance) {
    // server.route({
    //   method: "POST",
    //   url: "/api/login",
    //   handler: this.controller.login,
    // });
  }
}

export default AuthRoutes;
