import { UserRepository } from "../../domain/repositories/UserRepository";

export const getUserById = (repo: UserRepository, id: number) =>
  repo.findById(id);
export const getAllUsers = (repo: UserRepository) => repo.findAll();
export const getUsersWhichContains = (
  repo: UserRepository,
  search: string,
  page: number,
  limit: number
) => repo.findManyWithFilters({ search, page, limit });
