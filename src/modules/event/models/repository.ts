import { Event } from "./event";

export interface EventRepository {
  create: (event: Event) => Promise<{ id: string }>;
  findMany: (filter: string, value: string) => Promise<Event[]>;
  findOne: (filter: string, value: string) => Promise<Event | null>;
  findById: (id: string) => Promise<Event | null>;
  update: (id: string, event: Partial<Event>) => Promise<void>;
}
