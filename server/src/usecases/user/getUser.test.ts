import { getUserById, getAllUsers } from "./getUser";
import { createUser } from "./createUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

describe("getUser", () => {
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

  it("should retrieve a user by ID", async () => {
    const repo = createInMemoryUserRepo();
    const created = await createUser(repo, {
      name: "Carol",
      email: "carol@mail.com",
    });
    const fetched = await getUserById(repo, created.id!);
    expect(fetched).toEqual(created);
  });

  it("should return null for non-existing user by ID", async () => {
    const repo = createInMemoryUserRepo();
    const user = await getUserById(repo, 999);
    expect(user).toBeNull();
  });

  it("should list all users", async () => {
    const repo = createInMemoryUserRepo();
    await createUser(repo, { name: "User1", email: "u1@mail.com" });
    await createUser(repo, { name: "User2", email: "u2@mail.com" });
    const users = await getAllUsers(repo);
    expect(users).toHaveLength(2);
  });
});
