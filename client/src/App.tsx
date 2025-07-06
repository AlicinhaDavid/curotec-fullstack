import { Routes, Route, Link } from "react-router-dom";
import CreateUser from "./pages/CreateUser";
import DeleteUser from "./pages/DeleteUser";
import EditUser from "./pages/EditUser";
import FindUser from "./pages/FindUser";
import ListUsers from "./pages/ListUsers";

function App() {
  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>User Management</h1>
        <nav style={{ marginBottom: "2rem" }}>
          <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
            <li>
              <Link to="/">List Users</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/edit">Edit</Link>
            </li>
            <li>
              <Link to="/delete">Delete</Link>
            </li>
            <li>
              <Link to="/find">Find</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<ListUsers />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/edit" element={<EditUser />} />
          <Route path="/delete" element={<DeleteUser />} />
          <Route path="/find" element={<FindUser />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
