import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  TMDB_API_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  FRONTEND_URL: z.string(),
});

const safeEnv = envSchema.safeParse(process.env);

if (safeEnv.error) throw safeEnv.error;

export const env = safeEnv.data;
