import mysql from "mysql2/promise";
import { Env } from "../lib/types";

async function makeDb({ env }: { env: Env }) {
  const connection = await mysql.createConnection({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: "countries",
  });

  await connection.connect();

  const startTimeout = () => {
    return setInterval(async () => {
      try {
        await connection.ping();
      } catch (err) {
        console.error("Connection ping failed", err);
      }
    }, 5000);
  };

  startTimeout();

  connection.on("error", async (err) => {
    console.error("connection error");
    console.error(err.code); // 'ER_BAD_DB_ERROR'
    console.log(err);
  });

  return connection;
}

export default makeDb;
