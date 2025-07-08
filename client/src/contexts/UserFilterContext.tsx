import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Type definition for the user filters context.
 *
 * Includes search term, current page, items per page (limit),
 * and setters to update each of these states.
 */

type UserFilterContextType = {
  search: string;
  page: number;
  limit: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
};

/**
 * React Context to hold the user filters state and setters.
 * Initialized with undefined to enforce usage within provider.
 */
const UserFilterContext = createContext<UserFilterContextType | undefined>(
  undefined
);

/**
 * Context provider component that manages the user filters state.
 *
 * Provides the current filter values and setters to child components
 * via context.
 *
 * @param children - React child nodes wrapped by this provider.
 */
export const UserFilterProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  return (
    <UserFilterContext.Provider
      value={{ search, page, limit, setSearch, setPage, setLimit }}
    >
      {children}
    </UserFilterContext.Provider>
  );
};
/**
 * Custom hook to consume UserFilterContext.
 *
 * Throws an error if used outside of UserFilterProvider to ensure
 * proper context usage.
 *
 * @returns The user filters state and setters.
 */
export const useUserFilters = () => {
  const ctx = useContext(UserFilterContext);
  if (!ctx)
    throw new Error("useUserFilters must be used inside UserFilterProvider");
  return ctx;
};
