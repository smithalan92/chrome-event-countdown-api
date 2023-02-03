import * as awilix from "awilix";
import Server from "./lib/Server";
import makeAuthenticateUserMiddleware from "./middleware/authenticateUser";

/**
 * Creates server
 *
 * @param {object} container
 * @returns {object} server
 */
async function makeServer(container: awilix.AwilixContainer) {
  const server = new Server(container.cradle);

  // Load all repos to the container
  container.loadModules(["repositories/**"], {
    formatName: "camelCase",
    cwd: __dirname,
    resolverOptions: {
      lifetime: awilix.Lifetime.SCOPED,
    },
  });

  // Load all controllers to the container
  container.loadModules(["controllers/**"], {
    formatName: "camelCase",
    cwd: __dirname,
    resolverOptions: {
      lifetime: awilix.Lifetime.SCOPED,
    },
  });

  const routesPath = "routes/**";

  // Load routes
  container.loadModules([routesPath], {
    formatName: "camelCase",
    cwd: __dirname,
    resolverOptions: {
      lifetime: awilix.Lifetime.SCOPED,
    },
  });

  // Register any middleware handlers
  const authUserMiddleware = makeAuthenticateUserMiddleware(container.cradle);
  container.register("authUserMiddleware", awilix.asValue(authUserMiddleware));

  // Then register routes
  awilix
    .listModules([routesPath], {
      cwd: __dirname,
    })
    .forEach((moduleDesc) => {
      let { name, path } = moduleDesc;

      if (path.includes(".types")) return;

      name = name.slice(0, 1).toLowerCase() + name.slice(1);
      server.registerRoutes(container.resolve(name));
    });

  return server;
}

export default makeServer;
