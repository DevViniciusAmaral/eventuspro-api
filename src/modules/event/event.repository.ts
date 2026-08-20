import { database } from "../../lib/database";
import { EventRepository } from "./models/repository";
import { Event } from "./models/event";

export const eventRepository: EventRepository = {
  create: (data) => database.create<Event>("events", data),
  list: () => database.list<Event>("events"),
  findMany: (filter, value) =>
    database.findMany<Event>("events", filter, value),
  findOne: (filter, value) => database.findOne<Event>("events", filter, value),
  findById: (id) => database.findById<Event>("events", id),
  update: (id, data) => database.update<Event>("events", id, data),
};
