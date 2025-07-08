import { createServer } from "./infraestructure/web/server";

const app = createServer();
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
