import { preHandlerHookHandler, RouteHandler } from "fastify";
import { ContainerCradle } from "../container.types";

export default function makeAuthenticateUserMiddleware({ authRepository }: ContainerCradle) {
  const handler: preHandlerHookHandler = async (req, reply, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return reply.code(401).send({ error: "Not authorised" });
    }

    const userId = await authRepository.getUserIdForToken(token);

    if (!userId) {
      return reply.code(401).send({ error: "Not authorised" });
    }

    req.requestContext.set("userId", userId);
    next();
  };

  return handler;
}
