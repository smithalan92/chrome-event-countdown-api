import { Connection, OkPacket } from "mysql2/promise";
import knex, { Knex } from "knex";
import {
  Country,
  City,
  Coordinates,
  GetCitiesForCountryParams,
  GetEventsForUserDBResponse,
  ProcessedEvent,
  GetOrderDBResult,
  DBNoteResult,
} from "./AppRepository.types";
import { AddEventBody, GenericSearchQuery, UpdateEventBody } from "../controllers/AppController.types";
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
    let query = this.knex("countries").select("id", "name").orderBy("name");
    query = this._applyOptionstoQuery(query, { searchTerm, offset, limit });

    const results = await this.db.runQuery<Country[]>({
      query: query.toQuery(),
    });

    return results;
  }

  async getCitiesForCountry({ countryId, searchTerm, offset, limit }: GetCitiesForCountryParams) {
    let query = this.knex<City>("cities")
      .select("id", "name", "timezoneName")
      .where("countryId", countryId)
      .orderBy("name");

    query = this._applyOptionstoQuery(query, { searchTerm, offset, limit });

    const results = await this.db.runQuery<City[]>({
      query: query.toQuery(),
    });

    return results;
  }

  async getCityCoordinates(cityId: number) {
    const expression = this.knex("cities").select("lat", "lng").where("id", cityId);

    const [cordinates] = await this.db.runQuery<Coordinates[]>({
      query: expression.toQuery(),
    });

    if (!cordinates) {
      throw new Error("City not found");
    }

    return cordinates;
  }

  _processDBEvent(event: GetEventsForUserDBResponse): ProcessedEvent {
    return {
      id: event.id,
      name: event.name,
      eventDate: event.dateTime,
      order: event.order,
      background: event.background,
      city: {
        id: event.cityId,
        name: event.cityName,
        timezoneName: event.timezoneName,
      },
      country: {
        id: event.countryId,
        name: event.countryName,
      },
    };
  }

  async getEventsForUser(userId: number) {
    const expression = this.knex("events AS e")
      .select(
        "e.id",
        "e.name",
        "e.dateTime",
        "e.background",
        "e.order",
        "ci.id as cityId",
        "ci.name as cityName",
        "ci.timezoneName",
        "cu.id as countryId",
        "cu.name as countryName"
      )
      .leftJoin("cities AS ci", "ci.id", "e.cityId")
      .leftJoin("countries AS cu", "cu.id", "ci.countryId")
      .where("e.userId", userId);

    const events = await this.db.runQuery<GetEventsForUserDBResponse[]>({
      query: expression.toQuery(),
    });

    return events.map<ProcessedEvent>(this._processDBEvent);
  }

  async getEvent(userId: number, eventId: number) {
    const expression = this.knex("events AS e")
      .select(
        "e.id",
        "e.name",
        "e.dateTime",
        "e.background",
        "e.order",
        "ci.id as cityId",
        "ci.name as cityName",
        "ci.timezoneName",
        "cu.id as countryId",
        "cu.name as countryName"
      )
      .leftJoin("cities AS ci", "ci.id", "e.cityId")
      .leftJoin("countries AS cu", "cu.id", "ci.countryId")
      .where("e.userId", userId)
      .where("e.id", eventId);

    const [event] = await this.db.runQuery<GetEventsForUserDBResponse[]>({
      query: expression.toQuery(),
    });

    return this._processDBEvent(event);
  }

  async getNextEventOrderForUser(userId: number) {
    const [result] = await this.db.runQuery<GetOrderDBResult[]>({
      query: "SELECT MAX(`order`) as `order` FROM events WHERE userId = ?",
      values: [userId],
    });

    return result.order + 1;
  }

  async addEvent(userId: number, event: AddEventBody) {
    const order = await this.getNextEventOrderForUser(userId);

    const expression = this.knex("events").insert({
      name: event.name,
      dateTime: event.eventDate,
      background: event.background,
      cityId: event.cityId,
      userId,
      order,
    });

    const result = await this.db.runQuery<OkPacket>({
      query: expression.toQuery(),
    });

    if (result.insertId) return result.insertId;

    throw new Error("Failed to insert new event");
  }

  async updateEvent(userId: number, eventId: number, event: UpdateEventBody) {
    const expression = this.knex("events")
      .update({
        name: event.name,
        dateTime: event.eventDate,
        background: event.background,
        cityId: event.cityId,
      })
      .where("id", eventId)
      .where("userId", userId);

    const result = await this.db.runQuery<OkPacket>({
      query: expression.toQuery(),
    });

    if (result.affectedRows !== 1) {
      throw new Error("Failed to update event");
    }
  }

  async deleteEvent({ userId, eventId }: { userId: number; eventId: number }) {
    const expression = this.knex("events").delete().where("id", eventId).where("userId", userId);

    const result = await this.db.runQuery<OkPacket>({
      query: expression.toQuery(),
    });

    if (result.affectedRows !== 1) {
      throw new Error("Failed to delete event");
    }
  }

  async reorderEvents({ userId, eventIds }: { userId: number; eventIds: number[] }) {
    const makeQuery = ({ order, eventId, userId }: { order: number; eventId: number; userId: number }) => {
      return this.knex("events").update("order", order).where("id", eventId).where("userId", userId).toQuery();
    };

    // Not ideal, but it'll work for now
    for (const idx in eventIds) {
      await this.db.runQuery({
        query: makeQuery({ order: parseInt(idx, 10) + 1, eventId: eventIds[idx], userId }),
      });
    }
  }

  async getNotes({ userId }: { userId: number }) {
    const notes = await this.db.runQuery<DBNoteResult[]>({
      query: this.knex("notes").select("id", "text").where("userId", userId).toQuery(),
    });

    return notes;
  }

  async getNote({ noteId, userId }: { noteId: number; userId: number }) {
    const [note] = await this.db.runQuery<DBNoteResult[]>({
      query: this.knex("notes").select("id", "text").where("userId", userId).where("id", noteId).toQuery(),
    });

    return note;
  }

  async addNote({ text, userId }: { text: string; userId: number }) {
    const result = await this.db.runQuery<OkPacket>({
      query: this.knex("notes").insert({ text, userId }).toQuery(),
    });

    if (result.insertId) return result.insertId;

    throw new Error("Failed to insert new note");
  }

  async updateNote({ noteId, text, userId }: { noteId: number; text: string; userId: number }) {
    const result = await this.db.runQuery<OkPacket>({
      query: this.knex("notes").update({ text }).where("id", noteId).where("userId", userId).toQuery(),
    });

    if (result.affectedRows !== 1) {
      throw new Error("Failed to update note");
    }
  }

  async deleteNote({ noteId, userId }: { noteId: number; userId: number }) {
    const result = await this.db.runQuery<OkPacket>({
      query: this.knex("notes").delete().where("id", noteId).where("userId", userId).toQuery(),
    });

    if (result.affectedRows !== 1) {
      throw new Error("Failed to delete note");
    }
  }
}

export default AppRepository;
