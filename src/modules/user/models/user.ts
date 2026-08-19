import { UserType } from "../../../enums/user-type";

export interface User {
  name: string;
  email: string;
  type: UserType;
}
