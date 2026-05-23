# Deploy API to Vercel

## Option A — Vercel Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import your Git repo.
2. Set **Root Directory** to `server` (Edit → Root Directory → `server`).
3. Framework Preset: **Other** (uses `vercel.json`).
4. Add **Environment Variables** (Production + Preview + Development):

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Pooled Neon URL (`*-pooler*` host) from your `.env` |
   | `DATABASE_URL_UNPOOLED` | Direct Neon URL (non-pooler host) from your `.env` |
   | `CORS_ORIGIN` | `http://localhost:5173` (add UI URL later when deployed) |

5. Click **Deploy**.

6. Test: `https://<your-project>.vercel.app/api/health` → `{ "status": "ok" }`

## Option B — Vercel CLI

```bash
cd server
npx vercel login
npx vercel link          # create/link project, root = server
npx vercel env add DATABASE_URL
npx vercel env add DATABASE_URL_UNPOOLED
npx vercel env add CORS_ORIGIN
npx vercel --prod
```

Copy values from your local `server/.env` when prompted.

## Push code to GitHub

```bash
# From repo root — create repo on github.com first, then:
git remote add origin https://github.com/YOUR_USER/Recruitment_portal.git
git branch -M main
git push -u origin main
```

Then connect that repo in Vercel for automatic deploys on push.

## Notes

- Database is already seeded in Neon (ap-southeast-1). No need to run seed on Vercel.
- Use the **pooled** URL for `DATABASE_URL` and **direct** URL for `DATABASE_URL_UNPOOLED`.
- When you deploy the UI, set `VITE_API_URL=https://<api-project>.vercel.app/api` and add the UI URL to API `CORS_ORIGIN`.
