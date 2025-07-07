import { deleteUser } from "./deleteUser";
import { createUser } from "./createUser";
import { getUserById } from "./getUser";
import { createInMemoryUserRepo } from "./test-utils/createInMemoryUserRepo";

describe("deleteUser", () => {
  it("should delete a user", async () => {
    const repo = createInMemoryUserRepo();
    const user = await createUser(repo, { name: "Eve", email: "eve@mail.com" });
    await deleteUser(repo, user.id!);
    const fetched = await getUserById(repo, user.id!);
    expect(fetched).toBeNull();
  });
});
