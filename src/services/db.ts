import mysql from "mysql2/promise";
import { ContainerCradle } from "../container.types";

export default function makePool({ env }: ContainerCradle) {
  const pool = mysql.createPool({
    host: env.MYSQL_CHROME_EVENT_COUNTDOWN_HOST,
    user: env.MYSQL_CHROME_EVENT_COUNTDOWN_USER,
    password: env.MYSQL_CHROME_EVENT_COUNTDOWN_PASS,
    database: "chrome_event_countdown",
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  return pool;
}
