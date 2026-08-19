import z from "zod";

export const createEventSchema = z.object({
  organizerId: z.string().min(1, "O id do organizador do evento é obrigatório"),
  title: z.string().min(1, "O título do evento é obrigatório"),
  description: z.string().min(1, "A descrição do evento é obrigatória"),
  date: z.string().min(1, "A data do evento é obrigatória"),
  local: z.string().min(1, "O local do evento é obrigatório"),
  capacity: z.number().min(1, "A capacidade do evento é obrigatória"),
  price: z.number().min(1, "O preço do evento é inválido"),
});
