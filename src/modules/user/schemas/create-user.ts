import z from "zod";
import { UserType } from "../../../enums/user-type";

export const createUserSchema = z.object({
  name: z
    .string("O nome do usuário é obrigatório")
    .min(3, "O nome do usuário deve conter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
  type: z
    .enum(
      Object.values(UserType),
      `O tipo do usuário deve ser: ${Object.values(UserType).join(", ")}`,
    )
    .optional()
    .default(UserType.CLIENT),
});
