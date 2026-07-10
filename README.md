# SpotMTL

SpotMTL is a web application for discovering attractions, activities,
restaurants, outdoor locations, and hidden gems across Montreal.

## Current status

SpotMTL is currently an early full-stack prototype. The React home and search
interfaces are available, and the NestJS API can connect to PostgreSQL.
The search page still uses hard-coded attraction data.

Implemented backend infrastructure:

- Environment-based PostgreSQL configuration
- A reusable PostgreSQL connection pool
- Database verification before the API starts
- Database connection logging and error handling
- Graceful HTTP server and database-pool shutdown
- API and database health-check endpoints
- Automated configuration and health-endpoint tests

Not implemented yet:

- Database migrations and application tables
- Attraction API endpoints
- Moving the hard-coded attraction into PostgreSQL
- Authentication, protected routes, and saved attraction lists
- Firebase integration; Firebase is not installed or used by the application

## Architecture

```text
React + Vite frontend (port 5173)
              |
              | HTTP API requests
              v
Node + NestJS API using the Express adapter (port 3001)
              |
              | pg connection pool
              v
PostgreSQL database (port 5432 by default)
```

The browser never connects directly to PostgreSQL. Database credentials remain
on the server. When attraction integration is added, the React frontend will
retrieve data through the NestJS API.

## Tech stack

### Frontend

- JavaScript and JSX
- React
- React Router
- Vite
- Tailwind CSS

### Backend and database

- Node.js
- TypeScript
- NestJS using its Express adapter for the HTTP API
- PostgreSQL for persistent data
- `pg` for PostgreSQL connections and pooling
- `@nestjs/config` for validated environment configuration
- NestJS modules, controllers, services, exception filters, and lifecycle hooks

Firebase appeared in an earlier project plan, but it is not currently
integrated. Authentication and image storage providers will be selected in a
future phase.

## Project structure

```text
SpotMTL/
|-- src/                     React application
|   |-- authentication/      Planned login and signup components
|   |-- Components/          Shared UI components and current mock data
|   |-- Pages/               Application pages
|   `-- assets/              Static images
|-- server/                  NestJS and PostgreSQL backend
|   |-- scripts/             Command-line database utilities
|   |-- test/                Backend tests
|   |-- src/                 NestJS application source
|   |   |-- common/          Shared filters and safe logging
|   |   |-- config/          Validated environment configuration
|   |   |-- database/        Injectable PostgreSQL service
|   |   |-- health/          Health controller and module
|   |   |-- app.module.ts    Root NestJS module
|   |   `-- main.ts          API bootstrap
|   |-- .env.example         Safe environment-variable template
|   |-- nest-cli.json        NestJS CLI configuration
|   `-- tsconfig.json        Backend TypeScript configuration
|-- package.json             Frontend scripts and dependencies
`-- server/package.json      Backend scripts and dependencies
```

## Prerequisites

- Node.js 20.11 or newer
- npm
- PostgreSQL
- A PostgreSQL administrator account that can create roles and databases

## PostgreSQL setup

### 1. Create the application role and database

The following commands create a non-superuser application account and prompt
you to choose its password:

```powershell
createuser -h localhost -p 5432 -U postgres --pwprompt spotmtl_app
createdb -h localhost -p 5432 -U postgres -O spotmtl_app spotmtl
```

If the PostgreSQL commands are not on your Windows `PATH`, run them from the
PostgreSQL `bin` directory or create the same login role and database through
pgAdmin. Do not give `spotmtl_app` superuser privileges.

### 2. Install dependencies

From the repository root:

```powershell
npm install
npm --prefix server install
```

If PowerShell blocks `npm.ps1`, use `npm.cmd` in place of `npm`.

### 3. Configure local environment variables

Copy the safe template to a local `.env` file:

```powershell
Copy-Item server\.env.example server\.env
```

Then edit `server/.env` and replace the placeholder password with the password
chosen for `spotmtl_app`:

```dotenv
DATABASE_URL=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spotmtl
DB_USER=spotmtl_app
DB_PASSWORD="replace-with-your-own-password"
```

`server/.env` is ignored by Git and must never be committed. Commit only
`server/.env.example`, which contains no real credentials.

For a hosted PostgreSQL provider, set `DATABASE_URL` to the provider's URL.
When `DATABASE_URL` is present, it takes precedence over the individual
`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` values.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime environment; defaults to `development` |
| `PORT` | No | NestJS API port; defaults to `3001` |
| `CLIENT_ORIGIN` | No | Frontend origin allowed by CORS; defaults to `http://localhost:5173` |
| `DATABASE_URL` | Conditional | Complete PostgreSQL URL; replaces the individual connection values when set |
| `DB_HOST` | Without `DATABASE_URL` | PostgreSQL hostname |
| `DB_PORT` | Without `DATABASE_URL` | PostgreSQL port |
| `DB_NAME` | Without `DATABASE_URL` | Database name |
| `DB_USER` | Without `DATABASE_URL` | Application role name |
| `DB_PASSWORD` | Without `DATABASE_URL` | Application role password |
| `DB_SSL` | No | Set to `true` when the provider requires TLS |
| `DB_SSL_REJECT_UNAUTHORIZED` | No | Controls TLS certificate validation; defaults to `true` |
| `DB_POOL_MAX` | No | Maximum pool connections; defaults to `10` |
| `DB_IDLE_TIMEOUT_MS` | No | Idle connection timeout; defaults to `30000` |
| `DB_CONNECTION_TIMEOUT_MS` | No | New connection timeout; defaults to `5000` |

## Verify the database connection

Run the standalone connection check from the repository root:

```powershell
npm run db:check
```

A valid configuration prints a `Connected successfully` message. Invalid or
missing configuration exits with a non-zero status without starting the API.

## Run the application

Start the NestJS backend in watch mode in one terminal:

```powershell
npm run dev:server
```

Start the Vite frontend in another terminal:

```powershell
npm run dev
```

The frontend is available at `http://localhost:5173`, and the API is available
at `http://localhost:3001` by default.

## Health checks

Process health:

```text
GET http://localhost:3001/api/health
```

PostgreSQL connection health:

```text
GET http://localhost:3001/api/health/database
```

Test the database endpoint from PowerShell:

```powershell
Invoke-RestMethod http://localhost:3001/api/health/database
```

A successful database response has this shape:

```json
{
  "status": "ok",
  "database": "connected",
  "databaseTime": "2026-07-10T12:00:00.000Z",
  "latencyMs": 4
}
```

The endpoint returns HTTP `503` with a generic response if PostgreSQL becomes
unavailable. Database credentials and raw errors are never returned to the
client.

## Tests and production build

```powershell
npm run test:server
npm run lint:server
npm run build:server
npm run build
```

## Database migrations

There is currently no migration command because the application schema has not
been created yet. The next backend phase is to add versioned migrations,
create the attraction tables, implement attraction endpoints, seed the existing
mock attraction, and update the React search page to call the API.
