import { Timestamp } from "firebase-admin/firestore";
import { db } from "../../lib/firebase";
import { parseDateString } from "../../utils/parse-date-string";
import { TicketRepository } from "./models/repository";
import { Ticket } from "./models/ticket";

const collection = db.collection("tickets");

export const ticketRepository: TicketRepository = {
  create: async (data) => {
    const doc = await collection.add({ ...data, createdAt: Timestamp.now() });
    return { id: doc.id };
  },
  findMany: async (filter, value) => {
    const snapshot = await collection.where(filter, "==", value).get();
    if (snapshot.empty) return [];

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data.map((data) => parseDateString<Ticket>(data));
  },
  findById: async (id) => {
    const snapshot = await collection.doc(id).get();
    if (!snapshot.exists) return null;
    return parseDateString<Ticket>(snapshot.data() as Ticket);
  },
  delete: async (id) => {
    await collection.doc(id).delete();
  },
};
