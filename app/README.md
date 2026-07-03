# Placement Preparation Tracker

A full-stack student dashboard to track projects, skills, tasks, placement prep
resources, and weekly goals — with JWT authentication and a dark/yellow
high-contrast UI.

**Stack**
- Frontend: React + Vite + TypeScript, Tailwind CSS v4, React Router, Recharts (radar chart), Axios
- Backend: Express + TypeScript, JWT auth, bcrypt password hashing
- Database: PostgreSQL

## Features

- Email/password auth with JWT (register, login, protected routes)
- Sidebar navigation: Dashboard, Profile, Projects, Skills, Tasks, Placement Prep, Weekly Goals
- Projects CRUD (title, description, tech stack, repo/live links, status)
- Skills CRUD with 0–100 level + interactive **radar/spider chart** visualization
- Tasks board (todo / in progress / done) with priority and due dates
- Placement prep resources: add links/notes, mark to-study / studying / completed
- Weekly goals with a progress bar and quick +/- increment buttons
- Yellow-on-near-black high-contrast theme throughout

## Project structure

```
app/
├── backend/     Express + TypeScript API
└── frontend/    React + Vite + TypeScript SPA
```

## 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)

## 2. Database setup

Create the database:

```bash
createdb placement_tracker
# or, from psql:
# CREATE DATABASE placement_tracker;
```

## 3. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env with your PostgreSQL credentials and a strong JWT_SECRET

npm install
npm run db:init      # creates all tables from db/schema.sql
npm run dev          # starts the API on http://localhost:5000
```

## 4. Frontend setup

In a new terminal:

```bash
cd frontend
cp .env.example .env   # VITE_API_URL defaults to http://localhost:5000/api

npm install
npm run dev             # starts the app on http://localhost:5173
```

Open `http://localhost:5173`, register an account, and start tracking.

## 5. Production build

```bash
# backend
cd backend && npm run build && npm start

# frontend
cd frontend && npm run build   # outputs static files to frontend/dist
```

## API overview

All routes except `/api/auth/register` and `/api/auth/login` require an
`Authorization: Bearer <token>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account, returns JWT |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/me` | Current user profile |
| PUT | `/api/auth/me` | Update profile |
| GET/POST | `/api/projects` | List / create projects |
| PUT/DELETE | `/api/projects/:id` | Update / delete a project |
| GET/POST | `/api/skills` | List / create skills |
| PUT/DELETE | `/api/skills/:id` | Update / delete a skill |
| GET/POST | `/api/tasks` | List / create tasks |
| PUT/DELETE | `/api/tasks/:id` | Update / delete a task |
| GET/POST | `/api/resources` | List / create placement prep resources |
| PUT/DELETE | `/api/resources/:id` | Update / delete a resource |
| GET/POST | `/api/goals` | List / create weekly goals |
| PUT/DELETE | `/api/goals/:id` | Update / delete a goal |

## Notes for extending

- All data is scoped by `user_id`, enforced in every query — one user can never read another's rows.
- JWT secret and expiry are configured via `backend/.env`.
- The skill radar chart (`frontend/src/components/SkillRadarChart.tsx`) needs at least 3 skills to render.
- Color tokens live in `frontend/src/index.css` under the `@theme` block if you want to retheme.
