import z from "zod";

export const listMoviesSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
});
