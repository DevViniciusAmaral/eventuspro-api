import z from "zod";

export const listMoviesSchema = z.object({
  page: z.number().int().positive().optional().default(1),
});
