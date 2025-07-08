import { Router, Request, Response } from "express";
import { createUser } from "../../../usecases/user/createUser";
import {
  getUserById,
  getAllUsers,
  getUsersWhichContains,
} from "../../../usecases/user/getUser";
import { updateUser } from "../../../usecases/user/updateUser";
import { deleteUser } from "../../../usecases/user/deleteUser";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { validate } from "../middlewares/validate";
import { userSchema } from "../validationSchema/userSchema";
import { userIdSchema } from "../validationSchema/userIdSchema";
import { AppError } from "../errors/AppError";
import { filterQuerySchema } from "../validationSchema/filterQuerySchema";
export const makeUserRoutes = (repo: UserRepository): Router => {
  const router = Router();

  router.post(
    "/",
    validate(userSchema, "body"),
    async (req: Request, res: Response) => {
      const user = await createUser(repo, req.body);
      res.status(201).json(user);
    }
  );

  router.put(
    "/:id",
    validate(userIdSchema, "params"),
    validate(userSchema, "body"),
    async (req: Request, res: Response) => {
      const userById = await getUserById(repo, Number(req.params.id));
      if (!userById) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }
      const user = await updateUser(repo, Number(req.params.id), req.body);
      res.status(200).json(user);
    }
  );

  router.delete(
    "/:id",
    validate(userIdSchema, "params"),
    async (req: Request, res: Response) => {
      const userById = await getUserById(repo, Number(req.params.id));
      if (!userById) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }
      await deleteUser(repo, Number(req.params.id));
      res.status(204).send();
    }
  );

  router.get(
    "/filter",
    validate(filterQuerySchema, "query"),
    async (req: Request, res: Response) => {
      const { search = "", page = "1", limit = "10" } = req.query;

      const result = await getUsersWhichContains(
        repo,
        search.toString(),
        parseInt(page.toString(), 10),
        parseInt(limit.toString(), 10)
      );

      return res.status(200).json(result);
    }
  );

  router.get("/", async (req: Request, res: Response) => {
    const users = await getAllUsers(repo);
    res.json(users);
  });

  router.get(
    "/:id",
    validate(userIdSchema, "params"),
    async (req: Request, res: Response) => {
      const user = await getUserById(repo, Number(req.params.id));
      if (!user) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }
      res.json(user);
    }
  );

  return router;
};
