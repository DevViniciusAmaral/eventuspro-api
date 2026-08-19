import { Seat } from "./seat";

export interface Event {
  organizerId: string;
  title: string;
  description: string;
  date: string;
  local: string;
  capacity: number;
  price: number;
  seats: Seat[];
}
