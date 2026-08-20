export interface Ticket {
  id?: string;
  eventId: string;
  clientId: string;
  paymentId: string;
  isValid: boolean;
  checkin: { hash: string; qrcode: string };
  share: { hash: string; qrcode: string };
  seats: string[];
  createdAt?: string;
  updatedAt?: string;
}
