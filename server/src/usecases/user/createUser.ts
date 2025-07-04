import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

export const createUser = async (
  repo: UserRepository,
  data: { name: string; email: string }
): Promise<User> => {
  const exists = await repo.findByEmail(data.email);
  if (exists) throw new Error("User already exists");
  return repo.save({ name: data.name, email: data.email });
};
