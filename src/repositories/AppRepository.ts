import { Connection } from "mysql2/promise";
import knex, { Knex } from "knex";
import { Country, City, Coordinates } from "../lib/types";

interface BaseQueryParams {
  searchTerm?: string;
  offset?: number;
  limit?: number;
}

interface GetCitiesForCountryParams extends BaseQueryParams {
  countryId: number;
}

class AppRepository {
  db: Connection;
  knex: Knex;

  constructor({ db }: { db: Connection }) {
    this.db = db;
    this.knex = knex({ client: "mysql" });
  }

  _applyOptionstoQuery(query: Knex.QueryBuilder, { searchTerm, offset, limit }: BaseQueryParams) {
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

  async getCountries({ searchTerm, offset, limit }: BaseQueryParams) {
    let query = this.knex<Country>("countries").select("id", "name").from("countries").orderBy("name");
    query = this._applyOptionstoQuery(query, { searchTerm, offset, limit });

    const [results] = await this.db.query<Country[]>(query.toQuery());

    return results;
  }

  async getCitiesForCountry({ countryId, searchTerm, offset, limit }: GetCitiesForCountryParams) {
    let query = this.knex<City>("countries")
      .select("id", "name", "timezoneName")
      .from("cities")
      .where("countryId", countryId)
      .orderBy("name");

    query = this._applyOptionstoQuery(query, { searchTerm, offset, limit });

    const [results] = await this.db.query<City[]>(query.toQuery());

    return results;
  }

  async getCityCoordinates(cityId: number) {
    const expression = this.knex<Coordinates>("countries").select("lat", "lng").from("cities").where("id", cityId);

    const [results] = await this.db.query<Coordinates[]>(expression.toString());

    const [cordinates] = results;

    if (!cordinates) {
      throw new Error("City not found");
    }

    return cordinates;
  }
}

export default AppRepository;
