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

### Database
Create a MySQL database and run `server/schema.sql`.

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

The API runs on `http://localhost:3001` and the frontend on `http://localhost:5173`.
