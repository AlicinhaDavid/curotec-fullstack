import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

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
});
