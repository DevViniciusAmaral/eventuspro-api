import { Event } from "./event";

export interface EventRepository {
  create: (event: Event) => Promise<{ id: string }>;
}
