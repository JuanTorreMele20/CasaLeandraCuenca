# Casa Leandra (MVP reservas)

## Backend
- Node + Express + Postgres
- Health: GET /health
- Create reservation: POST /api/reservations

## Frontend
- Vite + React (mobile-first)
- Needs env: VITE_API_URL (e.g. https://api.tudominio.com)

## Render
- Backend: Web Service (root dir: backend)
- Frontend: Static Site (root dir: frontend, publish: dist)
- Postgres: run db_init.sql
