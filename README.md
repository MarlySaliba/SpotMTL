# SpotMTL

SpotMTL is a web application for discovering attractions, activities,
restaurants, outdoor locations, and hidden gems across Montreal.

## Current status

SpotMTL is currently an early full-stack prototype. The React home and search
interfaces are available, and the NestJS API connects them to PostgreSQL.
The search page loads and filters attraction records through the API, so
PostgreSQL is the runtime source of truth rather than a frontend mock file.

Implemented backend infrastructure:

- Environment-based PostgreSQL configuration
- A reusable PostgreSQL connection pool
- Versioned PostgreSQL migrations using `node-pg-migrate`
- An `attractions` table and idempotent development seed command
- A validated, filterable `GET /api/attractions` endpoint
- A React search interface connected to the attraction API
- PostgreSQL-backed user accounts and opaque authentication sessions
- Registration, login, logout, account, and administrator interfaces
- Server-enforced `user` and `administrator` roles
- A same-origin Vite development proxy for `/api` requests
- Database verification before the API starts
- Database connection logging and error handling
- Graceful HTTP server and database-pool shutdown
- API and database health-check endpoints
- Automated configuration, service, and endpoint tests

Not implemented yet:

- Attraction create, update, and delete endpoints
- An authenticated attraction-management interface
- Saved attraction lists
- Email verification, password recovery, and account self-deletion
- Production authentication hardening such as request rate limiting
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
on the server. The React search page sends HTTP requests to the attraction API,
which reads through the injectable `DatabaseService`.

## Tech stack

### Frontend

- JavaScript and JSX
- React
- React Router
- Vite
- Sass (SCSS), with Tailwind CSS utilities applied in stylesheet partials

### Backend and database

- Node.js
- TypeScript
- NestJS using its Express adapter for the HTTP API
- PostgreSQL for persistent data
- `pg` for PostgreSQL connections and pooling
- `node-pg-migrate` for versioned schema changes
- `@nestjs/config` for validated environment configuration
- `class-validator` and `class-transformer` for request validation
- Node.js `scrypt` password hashing and opaque database-backed sessions
- NestJS modules, controllers, services, exception filters, and lifecycle hooks

Firebase appeared in an earlier project plan, but it is not currently
integrated. Authentication is implemented directly in the NestJS and PostgreSQL
application; an image-storage provider has not been selected.

## Project structure

```text
SpotMTL/
|-- src/                     React application
|   |-- authentication/      Account forms, session state, and auth hooks
|   |-- api/                 Browser clients for the NestJS API
|   |-- Components/          Shared UI components
|   |-- Pages/               Application pages
|   `-- assets/              Static images
|-- server/                  NestJS and PostgreSQL backend
|   |-- migrations/          Versioned PostgreSQL schema migrations
|   |-- scripts/             Command-line database utilities
|   |-- test/                Backend tests
|   |-- src/                 NestJS application source
|   |   |-- auth/            Accounts, sessions, guards, and role checks
|   |   |-- attractions/     Attraction controller, service, DTOs, and types
|   |   |-- common/          Shared filters and safe logging
|   |   |-- config/          Validated environment configuration
|   |   |-- database/        Injectable PostgreSQL service
|   |   |-- health/          Health controller and module
|   |   |-- app.module.ts    Root NestJS module
|   |   `-- main.ts          API bootstrap
|   |-- .env.example         Safe environment-variable template
|   |-- nest-cli.json        NestJS CLI configuration
|   `-- tsconfig.json        Backend TypeScript configuration
|-- .env.example             Safe frontend API configuration template
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

### 4. Apply migrations and seed development data

From the repository root:

```powershell
npm run db:migrate
npm run db:seed
```

The migration command applies every pending migration in order and records each
one in PostgreSQL's `pgmigrations` table. The migrations create the attraction,
user-account, and authentication-session tables. The seed command is
idempotent: it inserts or updates the included Montreal attractions, including
`Oratoire Saint-Joseph`, without creating duplicates.

The seed file is development/bootstrap data, not the runtime database. To add
or revise a development attraction, update `server/scripts/seed-attractions.ts`
and rerun `npm run db:seed`; the resulting rows are stored in PostgreSQL and
appear in the React search automatically. The public API remains read-only
until an authenticated management interface is implemented.

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

### Frontend API configuration

The frontend calls `/api` by default. During local development, Vite proxies
that path to the NestJS server so the site works from either `localhost:5173`
or `127.0.0.1:5173` without exposing database credentials or requiring a second
browser origin.

The safe defaults are documented in the root `.env.example`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL used by browser API requests |
| `VITE_API_PROXY_TARGET` | `http://localhost:3001` | Local NestJS target used by the Vite development proxy |

Only set `VITE_API_BASE_URL` to an absolute URL when the production frontend
and API are hosted on different origins. Never place PostgreSQL credentials or
an administrative secret in a `VITE_*` variable because Vite exposes those
values to the browser.

## Verify the database connection

Run the standalone connection check from the repository root:

```powershell
npm run db:check
```

A valid configuration prints a `Connected successfully` message. Invalid or
missing configuration exits with a non-zero status without starting the API.

## Database migrations and seed data

Apply all pending migrations:

```powershell
npm run db:migrate
```

Roll back the most recently applied migration:

```powershell
npm run db:migrate:down
```

Create a timestamped TypeScript migration:

```powershell
npm run db:migration:create -- add-attraction-slug
```

Seed or refresh the development attraction records:

```powershell
npm run db:seed
```

Run these commands from the repository root. They use the same validated
`server/.env` database configuration as the NestJS application, including
support for either `DATABASE_URL` or the individual `DB_*` variables. Review a
down migration before using it against a database with data because rolling
back a table-creation migration removes that table and its rows.

## Run the application

Apply the migration and seed first, then start the NestJS backend in watch mode
in one terminal:

```powershell
npm run dev:server
```

Start the Vite frontend in another terminal:

```powershell
npm run dev
```

The frontend is available at `http://localhost:5173`, and the API is available
at `http://localhost:3001` by default. The frontend sends its development API
requests through the Vite `/api` proxy.

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

## Authentication and authorization

SpotMTL stores users and authentication sessions in PostgreSQL. Passwords are
stored as salted `scrypt` hashes. Successful registration or login creates a
random opaque session token in the HttpOnly `spotmtl_session` cookie; only the
token's SHA-256 hash is stored in PostgreSQL. The cookie uses `SameSite=Lax`, is
limited to `/api`, expires after seven days, and is marked `Secure` in
production. Authentication tokens are not stored in browser local storage.

The frontend sends authentication requests with `credentials: "include"`, and
the API enables credentialed CORS only for `CLIENT_ORIGIN`. Every unsafe request
(`POST`, `PUT`, `PATCH`, or `DELETE`) must also include this verification header:

```text
X-SpotMTL-Request: 1
```

The frontend API client adds the header automatically. Include it when testing
unsafe endpoints directly.

### Account endpoints

| Method and route | Purpose | Authentication |
| --- | --- | --- |
| `POST /api/auth/register` | Create a user account and session | Public |
| `POST /api/auth/login` | Verify credentials and create a session | Public |
| `GET /api/auth/me` | Return the current account | Session cookie |
| `POST /api/auth/logout` | Revoke the current session and clear its cookie | Optional session cookie |
| `GET /api/admin/users` | List user accounts | `administrator` role |

Registration accepts exactly `name`, `email`, and `password`. Passwords must be
between 12 and 128 characters:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "at-least-12-characters"
}
```

The server normalizes the email address, always assigns new accounts the
`user` role, and rejects unknown fields. In particular, sending `role` or
`isAdmin` returns HTTP `400`; the browser cannot grant administrator access.
Login accepts only `email` and `password`. Authentication responses expose a
safe user object containing `id`, `name`, `email`, and the server-derived role,
but authorization is always enforced again by NestJS guards using the current
database role.

### Frontend account routes

| Route | Purpose |
| --- | --- |
| `/signup` | Create an account |
| `/login` | Log in |
| `/account` | View the authenticated account and log out |
| `/admin` | Administrator-only account list |

Protected routes wait for `GET /api/auth/me` before rendering. Frontend role
checks control presentation only; `GET /api/admin/users` independently requires
an authenticated administrator session on the server.

### Assign an administrator role

Public registration can create only ordinary users. After that user has
registered, assign a role from a trusted server terminal:

```powershell
npm.cmd run db:set-user-role -- user@example.com administrator
```

The command updates an existing PostgreSQL user. It accepts only `user` or
`administrator` and is not exposed through the frontend or HTTP API. To remove
administrator access, run the same command with `user` as the final argument.

This is still prototype authentication. Before a public production launch,
deploy behind HTTPS and add operational controls such as login rate limiting,
account recovery, email verification where required, and a reviewed account
deletion and privacy process.

## Attractions API

The React search page uses this endpoint directly. A selection displayed as
"Aucune préférence" or "Not Specified" is omitted from the query so it behaves
as no filter rather than matching the literal database value.

List all attractions:

```text
GET http://localhost:3001/api/attractions
```

Example PowerShell request:

```powershell
Invoke-RestMethod "http://localhost:3001/api/attractions?activity=Museum&price=Free"
```

All filters are optional and may be combined:

| Query parameter | Accepted values |
| --- | --- |
| `activity` | `Not Specified`, `Hiking`, `Skiing`, `Museum`, `Escape Room`, `Eating Out`, `Dining In` |
| `price` | `Not Specified`, `Free`, `$`, `$$`, `$$$` |
| `location` | `Not Specified`, `Downtown`, `Nature`, `Suburbs`, `Chinatown` |
| `effort` | `Not Specified`, `Low`, `Medium`, `High` |
| `groupSize` | `Not Specified`, `Solo`, `Couple`, `Family`, `Group` |
| `season` | `Not Specified`, `Summer`, `Fall`, `Winter`, `Spring` |
| `time` | `Not Specified`, `Morning`, `Afternoon`, `Evening` |
| `dietaryRestrictions` | `Not Specified`, `Vegan`, `Vegetarian`, `Halal` |

Values are case-sensitive. Unknown parameters, repeated parameters, empty
values, and unsupported values return HTTP `400`. A valid query with no matches
returns HTTP `200` with an empty array.

Example response:

```json
[
  {
    "id": 1,
    "name": "Oratoire Saint-Joseph",
    "activity": "Museum",
    "price": "Free",
    "location": "Downtown",
    "effort": "Low",
    "groupSize": "Not Specified",
    "season": "Not Specified",
    "time": "Not Specified",
    "dietaryRestrictions": "Not Specified",
    "description": "Visit Montréal's landmark basilica, its gardens, and sweeping city views.",
    "imageUrl": "/src/assets/Oratoire_St_Joseph.jpg",
    "createdAt": "2026-07-27T12:00:00.000Z",
    "updatedAt": "2026-07-27T12:00:00.000Z"
  }
]
```

## Tests and production build

```powershell
npm run test:server
npm run test:e2e:server
npm run test:frontend
npm run lint:server
npm run build:server
npm run build
```
