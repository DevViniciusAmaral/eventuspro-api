import { Seat } from "./seat";

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  date: string;
  local: string;
  capacity: number;
  price: number;
  seats: Seat[];
  priceId: string;
}
