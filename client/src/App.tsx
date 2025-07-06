import CreateUser from "./pages/CreateUser";
import DeleteUser from "./pages/DeleteUser";
import EditUser from "./pages/EditUser";
import FindUser from "./pages/FindUser";
import ListUsers from "./pages/ListUsers";

function App() {
  return (
    <>
      <h1>User Management</h1>
      <CreateUser />
      <ListUsers />
      <EditUser />
      <DeleteUser />
      <FindUser />
    </>
  );
}

export default App;
