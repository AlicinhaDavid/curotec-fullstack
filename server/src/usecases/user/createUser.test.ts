import { createUser } from "./createUser";
import { createInMemoryUserRepo } from "./test-utils/createInMemoryUserRepo";

describe("createUser", () => {
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
