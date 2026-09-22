# JobFlow

A full-stack job application tracker built with React, Express.js and MySQL.

## Features
- Create, edit and delete job applications
- Track application status
- Search by company or position
- Dashboard counters
- REST API with MySQL persistence
- Responsive UI

## Tech Stack
- React + Vite
- Express.js
- MySQL
- HTML / CSS / JavaScript

## Run locally

Use Node.js 24 LTS, npm, and a running MySQL server. Run the commands from
this project folder (locally: `C:\Users\Administrator\projects\jobflow`).

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

This creates `client/dist`. The current frontend API URL is configured for local
development in `client/src/App.jsx`. This portfolio demo has no authentication;
all connected clients use the same application list.
