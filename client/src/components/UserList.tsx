import { useUserFilters } from "../contexts/UserFilterContext";
import { useGetUsersFilteredQuery } from "../api/userApi";
import { User } from "../types/User";

export default function UserList() {
  const { search, setSearch, page, setPage, limit } = useUserFilters();

  const { data, isLoading, isFetching, error, refetch } =
    useGetUsersFilteredQuery(
      { search, page, limit },
      {
        refetchOnMountOrArgChange: false,
      }
    );

  const totalPages = data ? Math.ceil(data.totalCount / limit) : 1;

  return (
    <div>
      <div className="inline-id-group">
        <input
          placeholder="Search by name/email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
        />
        <button onClick={() => refetch()} disabled={isFetching}>
          Refresh
        </button>
      </div>

      <div style={{ margin: "1rem 0" }}>
        {isFetching && <span>Updating...</span>}
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error fetching users.</p>}

      {data?.data.length ? (
        <ul>
          {data.data.map((user: User) => (
            <li key={user.id}>
              {user.name} — {user.email}
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
            setPage((prev) => (data && page < totalPages ? prev + 1 : prev))
          }
          disabled={!data || page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
