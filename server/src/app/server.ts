import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createPrismaUserRepository } from "../infraestructure/db/PrismaUserRepository";
import { makeUserRoutes } from "../infraestructure/web/UserController";

export const createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  app.use(express.json());

  const prisma = new PrismaClient();
  const userRepo = createPrismaUserRepository(prisma);

  app.use("/users", makeUserRoutes(userRepo));
  return app;
};
