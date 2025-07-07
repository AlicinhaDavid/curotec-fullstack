import { User } from "./User";

export type GetUsersFilteredResponse = {
  data: User[];
  totalCount: number;
};
