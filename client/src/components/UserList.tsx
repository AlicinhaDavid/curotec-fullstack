import { useUserFilters } from "../contexts/UserFilterContext";
import {
  useLazyGetUsersFilteredQuery,
  useGetUsersFilteredQuery,
} from "../api/userApi";
import { User } from "../types/User";
import { GetUsersFilteredResponse } from "../types/GetUsersFilteredResponse";

export default function UserList() {
  const { search, setSearch, page, setPage, limit } = useUserFilters();

  // Hook used to manually fetch users from the server (only on Refresh click)
  const [trigger, { isFetching, isLoading, error }] =
    useLazyGetUsersFilteredQuery();

  // Query that reads data only from cache and applies client-side filtering and pagination
  const { data: pagedUsers, totalCount }: GetUsersFilteredResponse =
    useGetUsersFilteredQuery(
      { search: "", page: 1, limit: 1000 }, // Base query for fetching all users into cache
      {
        // Cache-only read strategy — no automatic fetches triggered
        skip: false,
        refetchOnMountOrArgChange: false,
        selectFromResult: ({ data }) => {
          const allUsers = data?.data ?? [];

          // Filter users based on the current search input
          const filtered = allUsers.filter((user: User) => {
            const term = search.toLowerCase();
            return (
              user.name.toLowerCase().includes(term) ||
              user.email.toLowerCase().includes(term)
            );
          });

          // Apply pagination to the filtered results
          const start = (page - 1) * limit;
          const paged = filtered.slice(start, start + limit);

          return {
            data: paged,
            totalCount: filtered.length,
          };
        },
      }
    );

  const totalPages = Math.ceil((totalCount ?? 0) / limit);

  return (
    <div>
      <div className="inline-id-group">
        <input
          placeholder="Search by name/email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search input change
          }}
        />
        <button
          onClick={() => {
            // Triggers server fetch and populates the cache
            trigger({ search: "", page: 1, limit: 1000 });
          }}
          disabled={isFetching}
        >
          Refresh
        </button>
      </div>

      <div style={{ margin: "1rem 0" }}>
        {isFetching && <span>Updating...</span>}
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error fetching users.</p>}
      </div>

      {pagedUsers?.length ? (
        <ul>
          {pagedUsers.map((user: User) => (
            <li key={user.id}>
              {user.id} — {user.name} — {user.email}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No users found.</p>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() =>
            setPage((prev) =>
              pagedUsers && page < totalPages ? prev + 1 : prev
            )
          }
          disabled={!pagedUsers || page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
