import { Timestamp } from "firebase-admin/firestore";
import { db } from "../../lib/firebase";
import { EventRepository } from "./models/repository";

const collection = db.collection("events");

export const eventRepository: EventRepository = {
  create: async (data) => {
    const doc = await collection.add({ ...data, createdAt: Timestamp.now() });
    return { id: doc.id };
  },
};
