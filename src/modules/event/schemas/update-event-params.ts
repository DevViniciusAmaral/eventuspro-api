import z from "zod";

export const updateEventParamsSchema = z.object({
  id: z.string("O id do evento é obrigatório"),
});
