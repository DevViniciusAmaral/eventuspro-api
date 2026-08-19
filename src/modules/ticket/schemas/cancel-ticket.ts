import z from "zod";

export const cancelTicketSchema = z.object({
  id: z.string().min(1, "O id do ingresso é obrigatório"),
});
