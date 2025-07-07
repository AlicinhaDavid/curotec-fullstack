import { getUserById, getAllUsers, getUsersWhichContains } from "./getUser";
import { createUser } from "./createUser";
import { User } from "../../domain/entities/User";
import { createInMemoryUserRepo } from "./test-utils/createInMemoryUserRepo";

describe("getUser", () => {
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

  describe("getUsersWhichContains", () => {
    it("should return users whose names contain the search term, paginated", async () => {
      const repo = createInMemoryUserRepo();

      await createUser(repo, {
        name: "Alice Johnson",
        email: "alice@mail.com",
      });
      await createUser(repo, { name: "Bob Smith", email: "bob@mail.com" });
      await createUser(repo, { name: "Carol Alice", email: "carol@mail.com" });
      await createUser(repo, { name: "David", email: "david@mail.com" });

      const page = 1;
      const limit = 2;

      const result = await getUsersWhichContains(repo, "Alice", page, limit);

      expect(result.data).toHaveLength(2);
      expect(result.data.map((user: User) => user.name)).toEqual(
        expect.arrayContaining(["Alice Johnson", "Carol Alice"])
      );
    });

    it("should return an empty array if no user matches the search", async () => {
      const repo = createInMemoryUserRepo();

      await createUser(repo, { name: "Eve", email: "eve@mail.com" });

      const result = await getUsersWhichContains(repo, "Nonexistent", 1, 10);

      expect(result.data).toEqual([]);
    });

    it("should paginate the result correctly", async () => {
      const repo = createInMemoryUserRepo();

      await createUser(repo, { name: "Ana", email: "ana@mail.com" });
      await createUser(repo, { name: "Anabelle", email: "anabelle@mail.com" });
      await createUser(repo, { name: "Anderson", email: "anderson@mail.com" });

      const page1 = await getUsersWhichContains(repo, "An", 1, 2);
      const page2 = await getUsersWhichContains(repo, "An", 2, 2);

      expect(page1.data).toHaveLength(2);
      expect(page2.data).toHaveLength(1);
    });
  });
});
