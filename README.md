# Kaloss Coffee

Full stack coffee shop website built with Next.js, Node.js, MongoDB, and npm.

## Structure

- `frontend/` - Next.js application
- `backend/` - Node.js API server
- `database/` - MongoDB volume data directory

## Quick start

1. Install dependencies:
   - `cd frontend && npm install`
   - `cd backend && npm install`
2. Set environment variables in `frontend/.env.local` and `backend/.env`.
3. Start services:
   - `npm run dev` in `frontend`
   - `npm run dev` in `backend`

## Docker

Run `docker-compose up --build` to launch the database, backend, and frontend.
