import { User } from "../entities/User";
/**
 * UserRepository interface defines the contract for data operations
 * related to User entities. Any data source implementation (DB, mock, API)
 * must implement these methods to provide consistent access to user data.
 */
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: Omit<User, "id">): Promise<User>;
  update(id: number, user: Omit<User, "id">): Promise<User>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findManyWithFilters(params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: User[];
    totalCount: number;
  }>;
}
