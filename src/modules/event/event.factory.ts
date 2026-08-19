import { cleanObject } from "../../utils/clean-object";
import { Event } from "./models/event";

export const eventFactory = {
  execute: (data: Record<string, unknown>) => {
    return cleanObject<Event>({
      organizerId: data.organizerId,
      title: data.title,
      description: data.description,
      date: data.date,
      local: data.local,
      capacity: data.capacity,
      price: data.price,
      seats: data.seats,
    });
  },
};
