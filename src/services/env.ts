import { Env } from "./env.types";

export default function makeEnv() {
  return {
    ...process.env,
    SERVER_PORT: 3400,
    serviceName: "Chrome Event Countdown API",
  } as unknown as Env;
}
