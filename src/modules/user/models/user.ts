import { UserType } from "../../../enums/user-type";

export interface User {
  id?: string;
  name: string;
  email: string;
  type: UserType;
  createdAt?: string;
  updatedAt?: string;
}
