import { Ticket } from "./ticket";

export interface TicketRepository {
  findMany: (filter: string, value: string) => Promise<Ticket[]>;
}
