# User Management App

A fullstack application for managing users, including search and pagination features, built with React, Node.js, Prisma, and RTK Query.

---

## Technologies

- **Frontend**: React, Vite, RTK Query, Context API
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Validation**: Zod, React Hook Form
- **Containers**: Docker, Docker Compose

---

## Setup Instructions

### Requirements

To run this project entirely inside containers, you only need to install the following tools **locally**:

### Docker

Used to build and run containers for the backend, frontend, and database.

- **Minimum version:** `Docker 20.10+`
- **Install:** [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

### Docker Compose

Used to manage and start multiple containers with a single command.

- **Minimum version:** `Docker Compose 1.29+`
- **Install:** [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

### Make

Used to simplify commands like `make up` and `make down`.  
If you don’t want to type long Docker commands, `make` helps a lot.

- **Minimum version:** `GNU Make 4.0+`
- **Install for macOS/Linux:** Usually pre-installed.
- **Install for Windows:**
  - Option 1: Use WSL (Windows Subsystem for Linux)
  - Option 2: Install [GnuWin Make](http://gnuwin32.sourceforge.net/packages/make.htm)

---

### Running the Project

```bash
make       # Transpile, build and start all containers
make down       # Stop and remove all containers
```

After running the containers, the following services will be available:

#### Server (API Backend)

- **URL:** http://localhost:3000;
- **Description:** Express + Prisma API connected to PostgreSQL.

#### Client (Frontend)

- **URL:** http://localhost:8000;
- **Description:** Vite + React application.

---

### User API Endpoints Documentation

> POST /users

Create a new user.

#### Request

- Content-Type: application/json

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

#### Response

- 201 Created

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}
```

---

> PUT /users/:id

Update an existing user by ID.

#### Request

- Content-Type: application/json

```http
GET /users/1
```

```json
{
  "name": "Alice",
  "email": "alice.d@example.com"
}
```

#### Response

- 200 OK

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice.d@example.com"
}
```

- 404 Not Found

```json
{
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "status": 404
  }
}
```

- 400 Bad Request (Validation error)

```json
{
  "error": {
    "message": "Validation error",
    "code": "VALIDATION_ERROR",
    "status": 400,
    "details": {
      "fieldErrors": {
        "email": ["Email is invalid"]
      },
      "formErrors": []
    }
  }
}
```

---

> DELETE /users/:id

Delete a user by ID.

#### Request

- Content-Type: application/json

```http
DELETE /users/1
```

```json
(No content in body)
```

#### Response

- 204 No Content

```json
(No content in body)
```

- 404 Not Found

```json
{
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "status": 404
  }
}
```

---

> GET /users/filter

Get users filtered by search with pagination.

#### Request

- Content-Type: application/json

```http
GET /users/filter?search=li&page=1&limit=10
```

```json
(No content in body)
```

#### Response

- 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "name": "Eliot",
      "email": "eliot@example.com"
    }
  ],
  "totalCount": 2,
  "page": 1,
  "limit": 10
}
```

- 400 Bad Request (Validation error)

```json
{
  "error": {
    "message": "Validation error",
    "code": "VALIDATION_ERROR",
    "status": 400,
    "details": {
      "fieldErrors": {
        "page": ["Page must be greater than 0"]
      },
      "formErrors": []
    }
  }
}
```

---

> GET /users

Get all users.

#### Request

- Content-Type: application/json

```http
GET /users/
```

```json
(No content in body)
```

#### Response

- 200 OK

```json
{
  "data": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "name": "Eliot",
      "email": "eliot@example.com"
    },
    {
      "id": 3,
      "name": "Bob Smith",
      "email": "bob@example.com"
    }
  ],
  "totalCount": 3,
  "page": 1,
  "limit": 10
}
```

---

> GET /users/:id

Get all users.

#### Request

- Content-Type: application/json

```http
GET /users/1
```

```json
(No content in body)
```

#### Response

- 200 OK

```json
{
  "id": 1,
  "name": "Alice David",
  "email": "alice@example.com"
}
```

- 404 Not Found

```json
{
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND",
    "status": 404
  }
}
```

### Prisma Migration

To create new migrations, first make the migration files using the proper command.

```bash
npx prisma migrate dev --name new-migration
```

Then, run the migration command to apply all pending migrations to the database. This keeps the database schema up to date.

```bash
npx prisma migrate deploy
```

## Project Technical Decision

This document contains a chronological list of key decisions made during the development of the project. Each decision includes the selected solution, alternatives considered, and the reason for the choice.

---

### Frontend Decisions

#### 1. Tech Stack for User CRUD

- **Decision:** React + Vite + React Hook Form + Zod + Axios
- **Alternatives:** Create React App, Formik, Yup, Fetch API
- **Why:**  
  Vite provides faster build and better developer experience.  
  React Hook Form has better performance and works directly with Zod.  
  Zod offers native TypeScript validation.  
  Axios gives more control over HTTP requests and responses.

---

#### 2. Reactive Form with Validation

- **Decision:** Use React Hook Form + Zod for form validation
- **Alternatives:** Yup, Joi, manual validation
- **Why:**  
  Zod works well with TypeScript and integrates easily with RHF.  
  No need to repeat types and validation logic.  
  Code is cleaner and easier to maintain.

---

#### 3. Page Structure for CRUD

- **Decision:** Create separate pages for list, create, edit, find by ID, and delete
- **Alternatives:** One single page with multiple actions
- **Why:**  
  Separation by responsibility improves readability and testing.  
  Makes it easier to reuse the form component.  
  Each page has a clear and simple purpose.

---

#### 4. Error Handling with Axios

- **Decision:** Use `axios.isAxiosError` to check HTTP errors
- **Alternatives:** Generic `catch` block with `instanceof Error`
- **Why:**  
  Makes sure the error is from an Axios request.  
  Access to useful response data like status and error message.  
  Safer and more consistent error handling.

---

#### 5. Applying Loading and Error States with React State

- **Decision:** Handle `loading`, `error`, and `success` states using local React state in components
- **Alternatives:** Global state management (e.g. Redux), external loading/error libraries, or no explicit UI feedback
- **Why:**
  - Local state is lightweight and sufficient for per-component control.
  - Avoids unnecessary complexity from global stores when state is only relevant to one screen.
  - Makes user feedback (e.g. spinners, error messages) explicit and predictable.
  - Encourages separation of concerns — logic for data fetching remains inside the component where it’s needed.
  - Keeps the interface responsive and informative during asynchronous operations.

---

#### 6. Smart Cache with Context API and RTK Query

- **Decision:** Combine RTK Query with Context API for filters (`search`, `page`, `limit`)
- **Alternatives:** Use only Context or Axios with `useEffect`
- **Why:**  
  RTK Query manages cache automatically.  
  Centralized filters avoid prop drilling.  
  Solution is scalable and follows good state management practices.

---

#### 7. Centralized API Configuration

- **Decision:** Create a single `api.ts` file with Axios instance
- **Alternatives:** Use Axios directly in each file
- **Why:**  
  Centralizes base URL and headers.  
  Easier to maintain and configure interceptors.  
  Keeps the code clean and organized.

---

#### 8. Use Lazy Query with Cache-First Strategy and Manual Refresh

- **Decision:** Combine `useLazyGetUsersFilteredQuery` to manually trigger server fetches only on refresh button click, while reading and filtering cached data locally on user input
- **Alternatives:** Automatically fetch data on every filter or pagination change without manual control
- **Why:**
  - Reduces unnecessary server calls by relying on cached data during search input and pagination
  - Improves responsiveness by performing filtering and pagination locally on cached data
  - Ensures fresh data on explicit user refresh actions
  - Gives clear control over network requests and cache usage
  - Balances user experience with efficient resource use

### Backend Decisions

#### 1. Use Clean Architecture

- **Decision:** Organize project using layers: domain, application, infrastructure, interface
- **Alternatives:** Traditional MVC, no clear structure
- **Why:**  
  Improves testability and separation of concerns.  
  Easier to replace frameworks.  
  Code is more organized and scalable.

---

#### 2. Dependency Inversion: Using Repository Interface for Data Access

- **Decision:** Define a `UserRepository` interface (with methods like `findById`, `findAll`, `create`, etc.) and inject it into use cases
- **Alternatives:** Call ORM (e.g., Prisma) directly inside controllers or use cases
- **Why:**
  - Inverts the dependency: the business logic depends on abstractions, not on concrete implementations (like Prisma).
  - Makes testing easier — repositories can be mocked without touching the database.
  - Follows Clean Architecture and SOLID principles.
  - Improves flexibility — you can switch from Prisma to another data source without affecting use cases.

---

#### 3. Schema Validation Middleware (Express)

- **Decision:** Use `validate(schema, target)` middleware for body and params
- **Alternatives:** Validate manually inside each controller
- **Why:**  
  Reduces repeated logic.  
  Keeps validation in one place.  
  Easy to test and reuse schemas.

---

#### 4. Zod for Validation

- **Decision:** Use Zod schemas for validation in middlewares
- **Alternatives:** Joi, Yup, manual validation
- **Why:**  
  Zod works well with TypeScript.  
  Same schemas can be reused in frontend.  
  Validation is fast and type-safe.

---

#### 5. Run Prisma Migrations in ENTRYPOINT

- **Decision:** Run `npx prisma migrate deploy` in the container’s entrypoint script
- **Alternatives:** Run during Dockerfile `RUN` step or image build
- **Why:**
  - `RUN` executes only at build time — so it won’t apply migrations when the container restarts.
  - Using the entrypoint ensures the database is updated every time the app starts.
  - It’s a reliable and automated solution for CI/CD and dynamic environments.

---

#### 2. Error Handling Strategy

- **Decision:** Use `AppError` class with a global Express middleware to handle all application errors.

- **Alternatives:** Local `try/catch` blocks in each route; default Express error handler.

- **Why:**  
   Centralizing the error handling with a global middleware ensures consistent error response structure across the application.  
   The `AppError` class allows better control over HTTP status codes, custom error codes, and optional detailed payloads (e.g., validation errors).  
   This approach reduces repetitive code in route handlers and improves error logging and debugging.  
   Validation middleware also uses `AppError`, which gives uniform structure for client-side error handling.

  ```json
  {
      "error": {
      "message": "Descriptive error message",
      "code": "ERROR_CODE",
      "status": 400,
      "details": { /_ optional _/ }
      }
  }
  ```

  ```json
  {
    "error": {
      "message": "Validation error",
      "code": "VALIDATION_ERROR",
      "status": 400,
      "details": {
        "fieldErrors": {
          "name": ["Name is required"],
          "email": ["Email is invalid"]
        },
        "formErrors": []
      }
    }
  }
  ```

---

### Containerization

#### 1. Using Docker for Client and Server

- **Decision:** Use Docker containers for both frontend (client) and backend (server)
- **Alternatives:** Run applications locally with manually installed dependencies
- **Why:**
  - Ensures consistent Node.js versions across all environments (local, CI, production).
  - Simplifies setup for new developers. One `docker-compose up` and the app runs.
  - Avoids issues caused by local differences in dependencies or OS.
  - Provides infrastructure-as-code and is future-proof for cloud deployment.

---

#### 2. Transpile Code Before Container Startup

- **Decision:** Transpile the backend TypeScript code using `tsc` during the image build step
- **Alternatives:** Transpile on container startup, or use `ts-node` in production
- **Why:**
  - Results in a smaller, faster production image — only contains compiled JS.
  - Prevents runtime TypeScript overhead (e.g. via `ts-node`).
  - Reduces surface area for runtime errors related to TypeScript.
  - More aligned with 12-factor app and container best practices.

---

### Developer Experience

#### 1. Using Makefile to Simplify Common Commands

- **Decision:** Use a `Makefile` to define common developer and build commands (e.g. `make up`, `make build`, `make migrate`)
- **Alternatives:** Rely on long or complex `docker`, `npm`, or `tsc` commands manually typed or documented in README
- **Why:**
  - Improves developer experience by reducing repetitive, error-prone terminal commands
  - Standardizes command usage across the team — no need to remember exact flags or scripts
  - Acts as a single source of truth for project automation
  - Makes onboarding easier and CI scripts cleaner
