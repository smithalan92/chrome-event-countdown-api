import knex, { Knex } from "knex";
import { OkPacket } from "mysql2";
import { randomUUID } from "crypto";
import DBAgent from "../lib/DBAgent";
import { ContainerCradle } from "../container.types";
import { DBUserByEmailResult } from "./AuthRepository.types";

class AuthRepository {
  db: DBAgent;
  knex: Knex;

  constructor({ db }: ContainerCradle) {
    this.db = db;
    this.knex = knex({ client: "mysql" });
  }

  async getUserByEmail(email: string) {
    const [user] = await this.db.runQuery<DBUserByEmailResult[]>({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    return user;
  }

  async createTokenForUser(userId: number) {
    const token = randomUUID();

    const result = await this.db.runQuery<OkPacket>({
      query: `
        INSERT INTO auth_tokens (userId, token)
        VALUES (?, ?);
      `,
      values: [userId, token],
    });

    if (result.insertId) {
      return token;
    } else {
      throw new Error("Failed to add new token");
    }
  }
}

export default AuthRepository;
