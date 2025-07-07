import { createContext, useContext, useState, ReactNode } from "react";

type UserFilterContextType = {
  search: string;
  page: number;
  limit: number;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
};

const UserFilterContext = createContext<UserFilterContextType | undefined>(
  undefined
);

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

export const useUserFilters = () => {
  const ctx = useContext(UserFilterContext);
  if (!ctx)
    throw new Error("useUserFilters must be used inside UserFilterProvider");
  return ctx;
};
