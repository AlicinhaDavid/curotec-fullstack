import { UserRepository } from "../../domain/repositories/UserRepository";

export const deleteUser = (repo: UserRepository, id: number) => repo.delete(id);
