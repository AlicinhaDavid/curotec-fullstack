import UserList from "../components/UserList";

export default function ListUsers() {
  return (
    <div className="container">
      <div style={{ padding: "2rem" }}>
        <h1>All Users</h1>
        <UserList />
      </div>
    </div>
  );
}
