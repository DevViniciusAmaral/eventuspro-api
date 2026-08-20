import { cleanObject } from "../../utils/clean-object";
import { User } from "./models/user";

export const userFactory = {
  execute: (data: Record<string, any>) => {
    return cleanObject<User>({
      name: data.name,
      email: data.email,
      type: data.type,
    });
  },
};
