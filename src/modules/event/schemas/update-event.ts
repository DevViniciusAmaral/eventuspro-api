import z from "zod";

export const updateEventSchema = z.object({
  title: z
    .string()
    .nonempty("O título do evento não pode ser um texto vazio")
    .optional(),
  description: z
    .string()
    .nonempty("A descrição do evento não pode ser um texto vazio")
    .optional(),
  date: z
    .string()
    .nonempty("A data do evento não pode ser um texto vazio")
    .optional(),
  local: z
    .string()
    .nonempty("O local do evento não pode ser um texto vazio")
    .optional(),
  capacity: z.number().min(1, "A capacidade do evento é inválida").optional(),
  price: z.number().min(1, "O preço do evento é inválido").optional(),
});
