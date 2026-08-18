import { Seat } from "./seat";

export interface Event {
  title: string;
  description: string;
  date: string;
  local: string;
  capacity: string;
  price: string;
  seats: Seat[];
}
