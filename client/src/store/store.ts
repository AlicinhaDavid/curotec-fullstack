import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";

/**
 * Configures the Redux store for the application.
 *
 * - Registers the `userApi` reducer under its designated path.
 * - Adds the `userApi.middleware` to enable automatic caching,
 *   invalidation, and loading states provided by RTK Query.
 */
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer, // Integrates userApi's reducer to handle API cache and metadata
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware), // Adds userApi middleware for query/mutation side effects
});

/**
 * RootState represents the global Redux state shape.
 * Useful for typing selectors.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch is the type of the store's dispatch function.
 * Useful for typing thunks or dispatch hooks.
 */
export type AppDispatch = typeof store.dispatch;
