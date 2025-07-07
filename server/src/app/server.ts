import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { createPrismaUserRepository } from "../infraestructure/db/PrismaUserRepository";
import { makeUserRoutes } from "../infraestructure/web/routes/UserController";

export const createServer = () => {
  const app = express();
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

  app.use(
    cors({
      origin: CLIENT_URL,
    })
  );

  app.use(express.json());

  const prisma = new PrismaClient();
  const userRepo = createPrismaUserRepository(prisma);

  app.use("/users", makeUserRoutes(userRepo));
  return app;
};
