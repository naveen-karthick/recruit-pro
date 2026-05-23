import type { CorsOptions } from 'cors'

function cleanOrigin(value: string): string {
  return value.trim().replace(/^["']|["']$/g, '')
}

function parseAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN
  if (!raw) return ['http://localhost:5173']
  return raw.split(',').map(cleanOrigin).filter(Boolean)
}

function isVercelAppOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin)
    return hostname === 'vercel.app' || hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

export function getCorsOptions(): CorsOptions {
  const allowed = parseAllowedOrigins()
  const allowVercel = process.env.CORS_ALLOW_VERCEL === 'true' || process.env.CORS_ALLOW_VERCEL === '1'

  if (allowed.includes('*')) {
    return { origin: true }
  }

  return {
    origin(origin, callback) {
      // Server-to-server or same-origin requests
      if (!origin) {
        callback(null, true)
        return
      }

      const normalized = cleanOrigin(origin)

      if (allowed.includes(normalized)) {
        callback(null, true)
        return
      }

      if (allowVercel && isVercelAppOrigin(normalized)) {
        callback(null, true)
        return
      }

      callback(null, false)
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  }
}
