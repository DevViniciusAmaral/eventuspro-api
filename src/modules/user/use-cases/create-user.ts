import { createUserSchema } from "../schemas/create-user";
import { userFactory } from "../user.factory";
import { userRepository } from "../user.repository";
import { ConflictError } from "../../../errors/conflict-error";

export const createUserUseCase = {
  execute: async (data: unknown) => {
    const userData = createUserSchema.parse(data);

    const existing = await userRepository.findOne("email", userData.email);
    if (existing) {
      throw new ConflictError("Usuário já cadastrado");
    }

    const formattedUser = userFactory.execute(userData);
    return userRepository.create(formattedUser);
  },
};
