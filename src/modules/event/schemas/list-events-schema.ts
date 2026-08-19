import z from "zod";

export const listEventsSchema = z.object({
  organizerId: z.string().nonempty("O organizador é obrigatório").optional(),
});
