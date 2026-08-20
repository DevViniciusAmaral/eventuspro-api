import { cleanObject } from "../../utils/clean-object";
import { Event } from "./models/event";

export const eventFactory = {
  execute: (data: Record<string, any>) => {
    return cleanObject<Omit<Event, "id">>({
      organizerId: data.organizerId,
      title: data.title,
      description: data.description,
      date: data.date,
      local: data.local,
      capacity: data.capacity,
      price: data.price,
      seats: data.seats,
      priceId: data.priceId,
    });
  },
};
