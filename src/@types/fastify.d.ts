import "fastify";
import { User } from "../modules/user/models/user";

declare module "fastify" {
  interface FastifyRequest {
    userAuth: { uid: string; email: string };
    userData: User;
  }
}
