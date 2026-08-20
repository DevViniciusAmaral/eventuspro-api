import { database } from "../../lib/database";
import { UserRepository } from "./models/repository";
import { User } from "./models/user";

export const userRepository: UserRepository = {
  create: (data) => database.create<User>("users", data),
  findOne: (filter, value) => database.findOne<User>("users", filter, value),
};
