import { deleteUser } from "./deleteUser";
import { createUser } from "./createUser";
import { getUserById } from "./getUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

describe("deleteUser", () => {
  const createInMemoryUserRepo = (): UserRepository => {
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
    };
  };

  it("should delete a user", async () => {
    const repo = createInMemoryUserRepo();
    const user = await createUser(repo, { name: "Eve", email: "eve@mail.com" });
    await deleteUser(repo, user.id!);
    const fetched = await getUserById(repo, user.id!);
    expect(fetched).toBeNull();
  });
});
