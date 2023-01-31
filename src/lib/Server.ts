import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import multipart from "@fastify/multipart";
import qs from "qs";
import cors from "@fastify/cors";
// import TokenRepository from "../repository/TokenRepository";
import fastifyRequestContext from "@fastify/request-context";
import { Router } from "../routes/routes.types";
import { ContainerCradle } from "../container.types";

class Server {
  server: FastifyInstance;
  port: number;
  // tokenRepository: TokenRepository;

  constructor({ env }: ContainerCradle) {
    this.server = this.createServer();
    this.port = env.SERVER_PORT;
    // this.tokenRepository = tokenRepository;
  }

  createServer() {
    const server = Fastify({
      querystringParser: (str) => qs.parse(str, { comma: true }),
      logger: {
        level: "info",
      },
    });

    void server.register(cors);
    void server.register(fastifyRequestContext, {
      defaultStoreValues: {
        userId: 0,
      },
    });
    void server.register(multipart);

    // server.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    //   if (request.routerPath === "/login") {
    //     return;
    //   }

    //   const token = request.headers.authorization;

    //   if (!token) {
    //     return reply.code(401).send({ error: "Not authorised" });
    //   }

    //   const userId = await this.tokenRepository.getUserIdForToken(token);

    //   if (!userId) {
    //     return reply.code(401).send({ error: "Not authorised" });
    //   }

    //   request.requestContext.set("userId", userId);
    // });

    server.addHook("onResponse", (request: FastifyRequest, reply: FastifyReply, done) => {
      console.log(`${request.method.toUpperCase()} ${request.routerPath} ${reply.statusCode}`);
      done();
    });

    return server;
  }

  registerRoutes(router: Router) {
    router.configure(this.server);
  }

  async start() {
    await this.server.listen({ port: this.port });
  }
}

export default Server;
