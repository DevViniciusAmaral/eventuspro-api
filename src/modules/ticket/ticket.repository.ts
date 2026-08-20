import { database } from "../../lib/database";
import { TicketRepository } from "./models/repository";
import { Ticket } from "./models/ticket";

export const ticketRepository: TicketRepository = {
  create: (data) => database.create<Ticket>("tickets", data),
  findOne: (filter, value) =>
    database.findOne<Ticket>("tickets", filter, value),
  findMany: (filter, value) =>
    database.findMany<Ticket>("tickets", filter, value),
  findById: (id) => database.findById<Ticket>("tickets", id),
  update: (id, data) => database.update<Ticket>("tickets", id, data),
  delete: (id) => database.delete("tickets", id),
};
