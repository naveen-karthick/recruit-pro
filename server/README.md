# EIREC API Server

Temporary MVP Node.js + Express + Prisma service for the EIREC CRM UI. Persists data in **Neon Postgres** until replaced by a Spring Boot backend.

## Project structure

```
server/
├── api/                  # Vercel serverless entry
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── src/
│   ├── routes/           # Express routers per domain
│   ├── services/         # Business logic + Prisma queries
│   ├── lib/              # Prisma client
│   ├── middleware/
│   ├── scripts/          # flush.ts
│   ├── app.ts            # Express app factory
│   └── server.ts         # Local dev entry
├── docs/API.md           # Full endpoint reference
└── vercel.json           # Vercel deployment config
```

## Local setup

### 1. Neon Postgres

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **pooled** connection string → `DATABASE_URL`
3. Copy the **direct** (non-pooler) connection string → `DATABASE_URL_UNPOOLED`

### 2. Environment

```bash
cd server
cp .env.example .env
# Edit .env with your Neon URLs
```

### 3. Install & database

```bash
npm install
npm run db:push      # Create tables
npm run db:seed      # Load demo data
npm run dev          # http://localhost:3001
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run db:push` | Push schema to Postgres |
| `npm run db:migrate` | Create migration (dev) |
| `npm run db:seed` | Seed demo data |
| `npm run db:flush` | Delete all rows |
| `npm run db:reset` | Flush + seed |

## Deploy API to Vercel (separate project)

### 1. Create Vercel project

- Import the repo (or deploy only the `server/` folder)
- Set **Root Directory** to `server`

### 2. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Neon **pooled** connection string |
| `DATABASE_URL_UNPOOLED` | Neon **direct** connection string (migrations) |
| `CORS_ORIGIN` | Your UI URL, e.g. `https://your-ui.vercel.app` |

For local UI + deployed API, use comma-separated origins:
`https://your-ui.vercel.app,http://localhost:5173`

### 3. Database on first deploy

Run locally against production Neon (recommended):

```bash
cd server
npm run db:push
npm run db:seed
```

Or add a one-time deploy hook / run from CI.

### 4. API URL

After deploy: `https://your-api.vercel.app/api/health`

---

## Deploy UI to Vercel (separate project)

### 1. Create second Vercel project

- Set **Root Directory** to `web`

### 2. Environment variable

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-api.vercel.app/api` |

No trailing slash. The UI client prepends this to all requests.

### 3. Build settings (defaults usually work)

- Build command: `npm run build`
- Output directory: `dist`

---

## Architecture (two Vercel deployments)

```
┌─────────────────────────┐         HTTPS          ┌─────────────────────────┐
│  UI (web/)              │  ──────────────────►   │  API (server/)          │
│  Vercel static/Vite     │   VITE_API_URL         │  Vercel serverless      │
│  your-ui.vercel.app     │                        │  your-api.vercel.app    │
└─────────────────────────┘                        └───────────┬─────────────┘
                                                               │
                                                               ▼
                                                   ┌─────────────────────────┐
                                                   │  Neon Postgres          │
                                                   └─────────────────────────┘
```

CORS on the API allows the UI origin via `CORS_ORIGIN`.

---

## API documentation

See [docs/API.md](./docs/API.md) for the complete endpoint list.

---

## Replacing with Spring Boot

Keep the same `/api/*` contract documented in `docs/API.md`. Point `VITE_API_URL` at the new Spring Boot base URL when ready.
