import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetUsersFilteredResponse } from "../types/GetUsersFilteredResponse";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/users" }),
  endpoints: (builder) => ({
    getUsersFiltered: builder.query<
      GetUsersFilteredResponse,
      { search: string; page: number; limit: number }
    >({
      query: ({ search, page, limit }) =>
        `filter?search=${search}&page=${page}&limit=${limit}`,
    }),
  }),
});

export const { useGetUsersFilteredQuery } = userApi;
