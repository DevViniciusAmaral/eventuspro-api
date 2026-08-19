import { cleanObject } from "../../utils/clean-object";
import { User } from "./models/user";

export const userFactory = {
  execute: (data: Record<string, unknown>) => cleanObject<User>(data),
};
