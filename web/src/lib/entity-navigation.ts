import type { QuickSearchTab } from '@/api/quick-search'
import { RECORD_STACK_PARAM, serializeStack, type RecordFrame } from '@/lib/record-drawer'

export const ENTITY_DRAWER_PARAM = 'id'

const ENTITY_ROUTES: Record<QuickSearchTab, string> = {
  candidates: '/candidates',
  contacts: '/contacts',
  companies: '/companies',
  jobs: '/jobs',
}

function recordFrameForEntity(entity: QuickSearchTab, id: string): RecordFrame | null {
  if (entity === 'candidates') return { type: 'candidate', id }
  if (entity === 'companies') return { type: 'company', id }
  if (entity === 'contacts') return { type: 'contact', id }
  if (entity === 'jobs') return { type: 'job', id }
  return null
}

export function entityDetailPath(entity: QuickSearchTab, id: string) {
  const base = ENTITY_ROUTES[entity]
  const frame = recordFrameForEntity(entity, id)
  if (frame) {
    return `${base}?${RECORD_STACK_PARAM}=${encodeURIComponent(serializeStack([frame]))}`
  }
  return `${base}?${ENTITY_DRAWER_PARAM}=${encodeURIComponent(id)}`
}

export function entityListPath(entity: QuickSearchTab) {
  return ENTITY_ROUTES[entity]
}
