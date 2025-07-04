import { Router, Request, Response } from "express";
import { createUser } from "../../usecases/user/createUser";

import { UserRepository } from "../../domain/repositories/UserRepository";

export const makeUserRoutes = (repo: UserRepository): Router => {
  const router = Router();

  router.post("/", async (req: Request, res: Response) => {
    try {
      const user = await createUser(repo, req.body);
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  return router;
};
