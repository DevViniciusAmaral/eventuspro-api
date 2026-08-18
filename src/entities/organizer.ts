import { User } from "./user";

export interface Organizer extends User {
  eventsId: string[];
}
