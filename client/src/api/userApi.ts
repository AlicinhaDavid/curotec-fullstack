import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetUsersFilteredResponse } from "../types/GetUsersFilteredResponse";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

/**
 * userApi slice created with Redux Toolkit Query.
 *
 * Provides a strongly typed interface to query users from backend,
 * supporting filtering by search term, pagination via page and limit.
 *
 * Automatically generates hooks to be used in React components.
 */
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    /**
     * Query to fetch filtered users.
     *
     * @param search - Search string to filter users by name or email.
     * @param page - Current page number for pagination.
     * @param limit - Number of users per page.
     *
     * Example request: GET /users/filter?search=john&page=1&limit=10
     */
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
