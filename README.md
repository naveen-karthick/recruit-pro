# EIREC Recruitment Portal

CRM UI + temporary Node.js API (MVP until Spring Boot backend).

| Folder | Description |
|--------|-------------|
| `web/` | React/Vite frontend |
| `server/` | Express + Prisma API (Neon Postgres) |

## Local development

```bash
# API
cd server && cp .env.example .env   # add Neon URLs
npm install && npm run dev          # http://localhost:3001

# UI
cd web && npm install && npm run dev  # http://localhost:5173
```

## Deploy to Vercel

Two separate Vercel projects:

1. **API** — root directory: `server` → see [server/README.md](./server/README.md)
2. **UI** — root directory: `web`, set `VITE_API_URL=https://your-api.vercel.app/api`
