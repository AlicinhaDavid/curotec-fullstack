import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { UserFilterProvider } from "./contexts/UserFilterContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <UserFilterProvider>
          <App />
        </UserFilterProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
