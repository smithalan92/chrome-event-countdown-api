import Hapi, { Request, ResponseToolkit } from "@hapi/hapi";
import { Env, Router } from "./types";

class Server {
  server: Hapi.Server;

  /**
   * Server constructor
   *
   * @param {object} log
   */
  constructor({ env }: { env: Env }) {
    this.server = this.createServer(env.SERVER_PORT);
  }

  createServer(port: number) {
    const server = Hapi.server({
      port: port,
      host: "localhost",
      routes: {
        cors: true,
      },
    });

    server.ext("onRequest", (request: Request, h: ResponseToolkit) => {
      if (request.method === "options") {
        return h.response().code(200).takeover();
      }

      return h.continue;
    });

    server.ext("onPreResponse", (request, h) => {
      // Cant get the correct type for req.response?
      const { response }: { response: any } = request;

      if (response) {
        h.response(request.response).header("hi-roisin", "<3");

        if (response.isBoom && response.isServer) {
          const error = response.error || response.message;

          if (!response.data) {
            console.error(error);
            console.log(response.stack);
          }
        }
      }

      return h.continue;
    });

    server.events.on("response", (req) => {
      // @ts-ignore - Cant get the correct type for req.response?
      console.log(`${req.path} ${req.response.statusCode}`);
    });

    return server;
  }

  registerRoutes(routes: Router) {
    routes.configure(this.server);
  }

  /**
   * Start the server
   *
   * @param {number} port
   */
  async start() {
    await this.server.start();
  }
}

export default Server;
