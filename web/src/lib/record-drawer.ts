export const RECORD_STACK_PARAM = 'stack'

export type RecordEntityType = 'company' | 'contact' | 'job' | 'candidate'

export interface RecordFrame {
  type: RecordEntityType
  id: string
}

export const MAX_RECORD_STACK = 2

export function frameKey(frame: RecordFrame) {
  return `${frame.type}:${frame.id}`
}

export function navigateToRecord(
  stack: RecordFrame[],
  next: RecordFrame,
): RecordFrame[] {
  const top = stack[stack.length - 1]
  if (top && top.type === next.type && top.id === next.id) return stack

  const existingIdx = stack.findIndex(
    (f) => f.type === next.type && f.id === next.id,
  )
  if (existingIdx >= 0) return stack.slice(0, existingIdx + 1)

  if (stack.length >= MAX_RECORD_STACK) {
    return [...stack.slice(0, -1), next]
  }

  return [...stack, next]
}

export function serializeStack(stack: RecordFrame[]): string {
  return stack.map((f) => frameKey(f)).join(',')
}

export function parseStack(value: string | null): RecordFrame[] {
  if (!value?.trim()) return []

  const frames: RecordFrame[] = []
  for (const part of value.split(',')) {
    const colon = part.indexOf(':')
    if (colon <= 0) continue
    const type = part.slice(0, colon) as RecordEntityType
    const id = part.slice(colon + 1)
    if (
      (type === 'company' ||
        type === 'contact' ||
        type === 'job' ||
        type === 'candidate') &&
      id
    ) {
      frames.push({ type, id })
    }
  }
  return frames.slice(0, MAX_RECORD_STACK)
}

export function stackFromLegacyParams(
  searchParams: URLSearchParams,
  sectionType: RecordEntityType,
): RecordFrame[] {
  const explicit = parseStack(searchParams.get(RECORD_STACK_PARAM))
  if (explicit.length > 0) return explicit

  const id = searchParams.get('id')
  const contact = searchParams.get('contact')
  const company = searchParams.get('company')

  if (id && contact) {
    return [
      { type: sectionType, id },
      { type: 'contact' as const, id: contact },
    ].slice(0, MAX_RECORD_STACK)
  }

  if (id && company) {
    return [
      { type: sectionType, id },
      { type: 'company' as const, id: company },
    ].slice(0, MAX_RECORD_STACK)
  }

  if (id) {
    return [{ type: sectionType, id }]
  }

  return []
}
