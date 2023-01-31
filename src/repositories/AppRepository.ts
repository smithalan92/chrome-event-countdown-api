import { Connection } from "mysql2/promise";
import knex, { Knex } from "knex";
import { Country, City, Coordinates, GetCitiesForCountryParams } from "./AppRepository.types";
import { GenericSearchQuery } from "../controllers/AppController.types";
import { ContainerCradle } from "../container.types";
import DBAgent from "../lib/DBAgent";

class AppRepository {
  db: DBAgent;
  knex: Knex;

  constructor({ db }: ContainerCradle) {
    this.db = db;
    this.knex = knex({ client: "mysql" });
  }

  _applyOptionstoQuery(query: Knex.QueryBuilder, { searchTerm, offset, limit }: GenericSearchQuery) {
    let query_copy = query.clone();

    if (searchTerm) {
      query_copy = query_copy.where(this.knex.raw("UPPER(name) LIKE UPPER(?)", [`${searchTerm}%`]));
    }

    if (offset) {
      query_copy = query_copy.offset(offset, { skipBinding: true });
    }

    if (limit) {
      query_copy = query_copy.limit(limit, { skipBinding: true });
    }

    return query_copy;
  }

  async getCountries({ searchTerm, offset, limit }: GenericSearchQuery) {
    let query = this.knex<Country>("chrome_event_countdown").select("id", "name").from("countries").orderBy("name");
    query = this._applyOptionstoQuery(query, { searchTerm, offset, limit });

    const results = await this.db.runQuery<Country[]>({
      query: query.toQuery(),
    });

    return results;
  }

  async getCitiesForCountry({ countryId, searchTerm, offset, limit }: GetCitiesForCountryParams) {
    let query = this.knex<City>("chrome_event_countdown")
      .select("id", "name", "timezoneName")
      .from("cities")
      .where("countryId", countryId)
      .orderBy("name");

    query = this._applyOptionstoQuery(query, { searchTerm, offset, limit });

    const results = await this.db.runQuery<City[]>({
      query: query.toQuery(),
    });

    return results;
  }

  async getCityCoordinates(cityId: number) {
    const expression = this.knex<Coordinates>("chrome_event_countdown")
      .select("lat", "lng")
      .from("cities")
      .where("id", cityId);

    const [cordinates] = await this.db.runQuery<Coordinates[]>({
      query: expression.toQuery(),
    });

    if (!cordinates) {
      throw new Error("City not found");
    }

    return cordinates;
  }
}

export default AppRepository;
