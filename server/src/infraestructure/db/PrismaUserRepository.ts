import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

/**
 * Helper to build case-insensitive filter for Prisma queries.
 * Used to perform search ignoring case in string fields.
 */
const insensitiveFilter = (value: string) => ({
  contains: value,
  mode: "insensitive" as const,
});

/**
 * Creates an implementation of UserRepository using Prisma ORM.
 * This repository interacts with a real database via PrismaClient.
 *
 * @param prisma - PrismaClient instance connected to the database.
 * @returns UserRepository implementation with Prisma-backed methods.
 */
export const createPrismaUserRepository = (
  prisma: PrismaClient
): UserRepository => ({
  findByEmail: async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? { id: user.id, name: user.name, email: user.email } : null;
  },

  save: async (user) => {
    const created = await prisma.user.create({ data: user });
    return { id: created.id, name: created.name, email: created.email };
  },

  update: async (id, user) => {
    const updated = await prisma.user.update({ where: { id }, data: user });
    return { id: updated.id, name: updated.name, email: updated.email };
  },

  delete: async (id) => {
    await prisma.user.delete({ where: { id } });
  },

  findById: async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? { id: user.id, name: user.name, email: user.email } : null;
  },

  findAll: async () => {
    const users = await prisma.user.findMany();
    return users.map((u: User) => ({ id: u.id, name: u.name, email: u.email }));
  },
  /**
   * Retrieves users filtered by search keyword with pagination.
   *
   * - Search is case-insensitive and matches name or email containing the term.
   * - Pagination is handled with 'page' and 'limit' parameters.
   * - Returns data array and total count for UI pagination.
   */
  findManyWithFilters: async ({ search = "", page = 1, limit = 10 }) => {
    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build filter for name or email containing search string, case-insensitive
    const where =
      search.trim() !== ""
        ? {
            OR: [
              { name: insensitiveFilter(search) },
              { email: insensitiveFilter(search) },
            ],
          }
        : {};

    // Run queries in parallel: fetch users and count total matching users
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      })),
      totalCount,
    };
  },
});
