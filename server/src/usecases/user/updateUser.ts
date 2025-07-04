import { UserRepository } from "../../domain/repositories/UserRepository";

export const updateUser = (
  repo: UserRepository,
  id: number,
  data: { name: string; email: string }
) => repo.update(id, data);
