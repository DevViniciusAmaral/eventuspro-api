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

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data.map((data) => parseDateString<Event>(data));
  },
  findOne: async (filter, value) => {
    const snapshot = await collection.where(filter, "==", value).get();
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return parseDateString<Event>({ id: doc.id, ...doc.data() });
  },
  findById: async (id) => {
    const snapshot = await collection.doc(id).get();
    if (!snapshot.exists) return null;

    const data = snapshot.data();
    return parseDateString<Event>({ id: snapshot.id, ...data });
  },
  update: async (id, data) => {
    await collection.doc(id).update({ ...data, updatedAt: Timestamp.now() });
  },
};
