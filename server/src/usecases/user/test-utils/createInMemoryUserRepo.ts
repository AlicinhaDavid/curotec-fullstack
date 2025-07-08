import { UserRepository } from "../../../domain/repositories/UserRepository";
import { User } from "../../../domain/entities/User";

/**
 * Creates an in-memory implementation of UserRepository for testing purposes.
 *
 * This repository stores users in a local array, simulating CRUD operations
 * without connecting to a real database.
 *
 * Useful for unit tests where isolation from external dependencies is needed.
 *
 * @returns UserRepository implementation with in-memory storage.
 */
export const createInMemoryUserRepo = (): UserRepository => {
  let id = 1;
  let data: User[] = [];

  return {
    findAll: async () => data,
    findById: async (id) => data.find((user) => user.id === id) || null,
    findByEmail: async (email) =>
      data.find((user) => user.email === email) || null,
    save: async (user) => {
      const newUser = { ...user, id: id++ };
      data.push(newUser);
      return newUser;
    },
    update: async (id, user) => {
      const index = data.findIndex((user) => user.id === id);
      if (index === -1) throw new Error("Not found");
      const updated = { ...user, id };
      data[index] = updated;
      return updated;
    },
    delete: async (id) => {
      data = data.filter((user) => user.id !== id);
    },
    findManyWithFilters: async ({ search = "", page = 1, limit = 10 }) => {
      const lowerSearch = search.toLowerCase().trim();

      const filtered = lowerSearch
        ? data.filter(
            (user) =>
              user.name.toLowerCase().includes(lowerSearch) ||
              user.email.toLowerCase().includes(lowerSearch)
          )
        : data;

      const totalCount = filtered.length;

      const paginated = filtered.slice((page - 1) * limit, page * limit);

      return {
        data: paginated,
        totalCount,
      };
    },
  };
};
