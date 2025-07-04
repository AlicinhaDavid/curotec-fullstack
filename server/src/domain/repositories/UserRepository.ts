import { User } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: Omit<User, "id">): Promise<User>;
  update(id: number, user: Omit<User, "id">): Promise<User>;
  delete(id: number): Promise<void>;
}
