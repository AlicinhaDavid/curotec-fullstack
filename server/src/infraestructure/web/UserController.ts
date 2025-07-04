import { Router, Request, Response } from "express";
import { createUser } from "../../usecases/user/createUser";
import { getUserById, getAllUsers } from "../../usecases/user/getUser";
import { updateUser } from "../../usecases/user/updateUser";
import { deleteUser } from "../../usecases/user/deleteUser";
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

  router.put("/:id", async (req: Request, res: Response) => {
    try {
      const user = await updateUser(repo, Number(req.params.id), req.body);
      res.json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    await deleteUser(repo, Number(req.params.id));
    res.status(204).send();
  });
  router.get("/", async (req: Request, res: Response) => {
    const users = await getAllUsers(repo);
    res.json(users);
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const user = await getUserById(repo, Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.json(user);
    }
  });

  return router;
};
