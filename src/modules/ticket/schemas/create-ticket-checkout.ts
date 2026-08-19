import z from "zod";

export const createTicketCheckoutSchema = z.object({
  eventId: z.string("O id do evento é obrigatório"),
  seats: z.array(
    z.string().min(1, "Informe os assentos desejados para a compra"),
  ),
});
