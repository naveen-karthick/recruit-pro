import type { CorsOptions } from 'cors'

const SHARED: Pick<CorsOptions, 'methods' | 'allowedHeaders' | 'optionsSuccessStatus'> = {
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}

export function getCorsOptions(): CorsOptions {
  const raw = process.env.CORS_ORIGIN?.trim().replace(/^["']|["']$/g, '')

  // MVP: allow all origins when unset or explicitly *
  if (!raw || raw === '*') {
    return { origin: '*', ...SHARED }
  }

  const allowed = raw.split(',').map((o) => o.trim().replace(/^["']|["']$/g, '')).filter(Boolean)

  if (allowed.includes('*')) {
    return { origin: '*', ...SHARED }
  }

  return {
    origin: allowed,
    ...SHARED,
  }
}
