import { updateUser } from "./updateUser";
import { createUser } from "./createUser";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

describe("updateUser", () => {
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

  it("should update an existing user", async () => {
    const repo = createInMemoryUserRepo();
    const user = await createUser(repo, {
      name: "David",
      email: "david@mail.com",
    });
    const updated = await updateUser(repo, user.id!, {
      name: "Dave",
      email: "dave@mail.com",
    });
    expect(updated.name).toBe("Dave");
    expect(updated.email).toBe("dave@mail.com");
  });

  it("should throw error when updating non-existent user", async () => {
    const repo = createInMemoryUserRepo();
    await expect(
      updateUser(repo, 999, { name: "Jack", email: "jack@mail.com" })
    ).rejects.toThrow("Not found");
  });
});
