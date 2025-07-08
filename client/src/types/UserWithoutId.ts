import { User } from "./User";

export type UserWithoutId = Omit<User, "id">;
