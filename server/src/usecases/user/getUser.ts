import { UserRepository } from "../../domain/repositories/UserRepository";

export const getUserById = (repo: UserRepository, id: number) =>
  repo.findById(id);
export const getAllUsers = (repo: UserRepository) => repo.findAll();
