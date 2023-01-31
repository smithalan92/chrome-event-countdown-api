import { Connection } from "mysql2/promise";
import knex, { Knex } from "knex";

class AuthRepository {
  db: Connection;
  knex: Knex;

  constructor({ db }: { db: Connection }) {
    this.db = db;
    this.knex = knex({ client: "mysql" });
  }

  async foo() {}
}

export default AuthRepository;
