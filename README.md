# JobFlow

A full-stack job application tracker built with React, Express.js and MySQL.

## Features
- Create, edit and delete job applications
- Track application status
- Search by company or position
- Filter by status and sort by newest, oldest, or company name
- Dashboard counters
- Confirm before deleting and receive feedback after saving
- Helpful empty states and retry after loading errors
- REST API with MySQL persistence
- Responsive UI

## Tech Stack
- React + Vite
- Express.js
- MySQL
- HTML / CSS / JavaScript

## Run locally

Use Node.js 24 LTS, npm, and a running MySQL server. Run the commands from
this project folder (locally: `C:\Users\ruslan\projects\portfolio\jobflow`).

### Database

1. Open MySQL Workbench and connect to your local MySQL server.
2. Choose **File > Open SQL Script** and open `server/schema.sql`.
3. Execute the entire script with the lightning button (or Ctrl+Shift+Enter).

The script creates the `jobflow` database and the `applications` table if they
do not already exist. It does not drop tables or delete data, and it does not
alter an existing table. The optional demo insert is commented out.

The table contains `id`, `company`, `position`, `status`, `link`, `notes`, and
`created_at`. Supported statuses: Wishlist, Applied, Interview, Offer, Rejected.

### Backend

In a PowerShell terminal:

```powershell
cd server
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm ci
npm run dev
```

Before starting, edit `server/.env` with your local MySQL credentials:

```dotenv
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=jobflow
```

Set `DB_PASSWORD` to your actual MySQL password. An empty value only works if
that account has no password. Quote values containing `#`, for example
`DB_PASSWORD="your#password"`. Never commit `.env`; it and `node_modules` are
ignored by Git. Restart the backend after editing `.env` (Ctrl+C, then
`npm run dev`). The configuration is loaded relative to the server files.

### Frontend

In a second terminal, starting from the project folder:

```powershell
cd client
npm ci
npm run dev
```

The API runs on `http://localhost:3001` and the frontend on `http://localhost:5173`.

### Check the API

```powershell
Invoke-RestMethod http://localhost:3001/api/health
Invoke-RestMethod http://localhost:3001/api/applications
```

Health returns `{"status":"ok"}` and checks that Express is running. The
applications endpoint also requires a working database and returns a JSON array.

| Method | Endpoint | Success |
| --- | --- | --- |
| GET | `/api/health` | 200 |
| GET | `/api/applications` | 200 |
| POST | `/api/applications` | 201 |
| PUT | `/api/applications/:id` | 200 |
| DELETE | `/api/applications/:id` | 204 |

POST and PUT accept JSON with `company`, `position`, `status`, `link`, and `notes`.
Company and position are required (maximum 120 characters each); link is optional
and must be an HTTP/HTTPS URL (maximum 255 characters). Invalid input returns 400,
missing records return 404, and unexpected server/database errors return 500 with
a JSON message. Database error codes are logged in the backend terminal.

If MySQL reports `ER_ACCESS_DENIED_ERROR`, check the user/password in `.env`.
For `ER_BAD_DB_ERROR` or `ER_NO_SUCH_TABLE`, run `server/schema.sql` in Workbench.
For `ECONNREFUSED`, check that MySQL is running. If port 3001 is already in use,
stop the old backend terminal before starting this copy.

### Production build

```powershell
cd client
npm run build
```

This creates `client/dist`. The API service in `client/src/services/api.js` defaults
to `http://localhost:3001`. Set `VITE_API_URL` in `client/.env` to use a different
backend origin, then restart Vite or rebuild. Only use public configuration in
Vite environment variables; they are included in the frontend bundle.
This portfolio demo has no authentication;
all connected clients use the same application list.

## Frontend structure

```text
client/src/
  components/
    Header.jsx
    Stats.jsx
    ApplicationForm.jsx
    ApplicationList.jsx
    ApplicationCard.jsx
  services/api.js
  applicationOptions.js
  App.jsx
  styles.css
```

`App.jsx` owns the shared React state and coordinates CRUD actions. Components
receive data and callbacks through props. The API service handles HTTP requests
and errors. Search, filters and sorting run locally on the loaded applications;
statistics always describe the complete list. Newest/oldest sorting uses
`created_at`, with the ID as a tie breaker. No additional libraries are required.

The existing schema remains unchanged. Location and application date are possible
future additions: an application date would be a nullable SQL DATE distinct from
the record's creation timestamp, and location an optional text field. Neither is
needed for the current dashboard, so existing databases need no migration.

## Manual verification

With both servers running, use a temporary application to check:

1. Load the list, create an application, reload and confirm it persists.
2. Edit its status and notes; check the success message and statistics.
3. Search by company and position, combine with each status filter, and clear filters.
4. Compare newest, oldest and company sorting with several entries.
5. Cancel deletion first, then confirm it; verify the entry disappears.
6. Check the empty list and the separate no-matches state.
7. Stop the API and reload: check the error message, restart it and choose Try again.
8. Check desktop, tablet and mobile layouts and keyboard focus.
9. Run `npm run build` in `client`.

On Windows, use `npm.cmd` instead of `npm` if PowerShell blocks `npm.ps1`.
