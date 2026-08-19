import { Timestamp } from "firebase-admin/firestore";
import { db } from "../../lib/firebase";
import { EventRepository } from "./models/repository";
import { Event } from "./models/event";
import { parseDateString } from "../../utils/parse-date-string";

const collection = db.collection("events");

export const eventRepository: EventRepository = {
  create: async (data) => {
    const doc = await collection.add({ ...data, createdAt: Timestamp.now() });
    return { id: doc.id };
  },
  findMany: async (filter, value) => {
    const snapshot = await collection.where(filter, "==", value).get();
    if (snapshot.empty) return [];

    const data = snapshot.docs.map((doc) => doc.data());
    return data.map((data) => parseDateString<Event>(data));
  },
  findOne: async (filter, value) => {
    const snapshot = await collection.where(filter, "==", value).get();
    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data();
    return parseDateString<Event>(data);
  },
};
