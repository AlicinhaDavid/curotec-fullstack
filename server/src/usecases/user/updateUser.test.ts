import { updateUser } from "./updateUser";
import { createUser } from "./createUser";
import { createInMemoryUserRepo } from "./test-utils/createInMemoryUserRepo";

describe("updateUser", () => {
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
