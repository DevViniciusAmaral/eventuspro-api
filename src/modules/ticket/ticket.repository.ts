import { db } from "../../lib/firebase";
import { parseDateString } from "../../utils/parse-date-string";
import { TicketRepository } from "./models/repository";
import { Ticket } from "./models/ticket";

const collection = db.collection("tickets");

export const ticketRepository: TicketRepository = {
  findMany: async (filter, value) => {
    const snapshot = await collection.where(filter, "==", value).get();
    if (snapshot.empty) return [];

    const data = snapshot.docs.map((doc) => doc.data());
    return data.map((data) => parseDateString<Ticket>(data));
  },
};
