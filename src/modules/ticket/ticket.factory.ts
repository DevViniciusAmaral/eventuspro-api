import { cleanObject } from "../../utils/clean-object";
import { Ticket } from "./models/ticket";

export const ticketFactory = {
  execute: (data: Record<string, any>) => {
    return cleanObject<Ticket>({
      eventId: data.eventId,
      clientId: data.clientId,
      paymentId: data.paymentId,
      sessionId: data.sessionId,
      isValid: data.isValid,
      checkin: data.checkin,
      share: data.share,
      seats: data.seats,
    });
  },
};
