import { createUser } from "./createUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

describe("createUser", () => {
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

  it("should create a user", async () => {
    const repo = createInMemoryUserRepo();
    const user = await createUser(repo, {
      name: "Alice",
      email: "alice@mail.com",
    });
    expect(user.id).toBe(1);
    expect(user.name).toBe("Alice");
  });

  it("should not allow duplicate emails", async () => {
    const repo = createInMemoryUserRepo();
    await createUser(repo, { name: "Bob", email: "bob@mail.com" });
    await expect(
      createUser(repo, { name: "Other Bob", email: "bob@mail.com" })
    ).rejects.toThrow("User already exists");
  });
});
