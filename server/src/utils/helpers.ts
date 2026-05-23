export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function paginate<T>(
  items: T[],
  page?: string | number,
  pageSize?: string | number,
): PaginatedResult<T> {
  const p = Math.max(1, Number(page) || 1)
  const ps = Math.max(1, Math.min(100, Number(pageSize) || 20))
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / ps))
  const start = (p - 1) * ps
  return {
    data: items.slice(start, start + ps),
    total,
    page: p,
    pageSize: ps,
    totalPages,
  }
}

export function searchFilter<T extends Record<string, unknown>>(
  items: T[],
  search: string | undefined,
  fields: (keyof T)[],
): T[] {
  const q = search?.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) =>
    fields.some((field) => {
      const val = item[field]
      if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(q))
      return val != null && String(val).toLowerCase().includes(q)
    }),
  )
}

export function stripReadOnly<T extends Record<string, unknown>>(
  obj: T,
  readOnlyKeys: string[],
): Partial<T> {
  const copy = { ...obj }
  readOnlyKeys.forEach((k) => delete copy[k as keyof T])
  return copy
}

export function formatAddress(addr: {
  addressLine1: string
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
}): string {
  return [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.country, addr.postalCode]
    .filter(Boolean)
    .join(', ')
}

export function toIso(date: Date): string {
  return date.toISOString()
}
