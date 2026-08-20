import axios from "axios";
import { env } from "../../config/env";

export const tmdbClient = axios.create({
  baseURL: env.TMDB_API_URL,
  headers: { Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}` },
});
