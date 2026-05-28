/**
 * Builds a prefix tsquery so partial terms match indexed lexemes.
 * Example: "Reac" -> "reac:*", "john smi" -> "john:* & smi:*"
 */
export function buildPrefixTsQuery(query: string): string | null {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/g, ''))
    .filter((term) => term.length > 0)

  if (terms.length === 0) return null

  return terms.map((term) => `${term}:*`).join(' & ')
}
