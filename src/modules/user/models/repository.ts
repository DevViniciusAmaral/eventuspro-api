import { User } from "./user";

export interface UserRepository {
  create: (user: User) => Promise<{ id: string }>;
  findOne: (filter: string, value: string) => Promise<User | null>;
}
