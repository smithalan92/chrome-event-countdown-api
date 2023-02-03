import knex, { Knex } from "knex";
import { OkPacket } from "mysql2";
import { randomUUID } from "crypto";
import DBAgent from "../lib/DBAgent";
import { ContainerCradle } from "../container.types";
import { DBUserByEmailResult, DBUserIDForTokenResult } from "./AuthRepository.types";

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

  async getUserIdForToken(token: string) {
    const [result] = await this.db.runQuery<DBUserIDForTokenResult[]>({
      query: `
        SELECT u.id from users u
        LEFT JOIN auth_tokens t ON t.userId = u.id
        WHERE t.token = ?
      `,
      values: [token],
    });

    return result ? result.id : null;
  }
}

export default AuthRepository;
