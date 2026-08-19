import { Event } from "./event";

export interface EventRepository {
  create: (event: Event) => Promise<{ id: string }>;
  findMany: (filter: string, value: string) => Promise<Event[]>;
  findOne: (filter: string, value: string) => Promise<Event>;
}
