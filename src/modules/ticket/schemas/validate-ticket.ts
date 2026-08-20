import z from "zod";

export const validateTicketSchema = z.object({
  hash: z.string().min(1, "O hash é obrigatório"),
});
