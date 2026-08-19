import { Ticket } from "./ticket";

export interface TicketRepository {
  create: (data: Ticket) => Promise<{ id: string }>;
  findMany: (filter: string, value: string) => Promise<Ticket[]>;
}
