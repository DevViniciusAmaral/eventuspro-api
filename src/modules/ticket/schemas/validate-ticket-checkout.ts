import z from "zod";

export const validateTicketCheckoutSchema = z.object({
  sessionId: z.string().min(1, "O id da sessão é obrigatório"),
});
