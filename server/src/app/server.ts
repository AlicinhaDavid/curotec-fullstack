import express from "express";
import { PrismaClient } from "@prisma/client";
import { createPrismaUserRepository } from "../infraestructure/db/PrismaUserRepository";
import { makeUserRoutes } from "../infraestructure/web/UserController";

export const createServer = () => {
  const app = express();
  app.use(express.json());

  const prisma = new PrismaClient();
  const userRepo = createPrismaUserRepository(prisma);

  app.use("/users", makeUserRoutes(userRepo));
  return app;
};
