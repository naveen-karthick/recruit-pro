import { Contact, Link2, Mail, Phone } from 'lucide-react'
import { StatCard } from '@/components/data/StatCard'
import type { ContactStats } from '@/api/contacts'

interface ContactsOverviewProps {
  stats?: ContactStats
  isLoading?: boolean
}

export function ContactsOverview({ stats, isLoading }: ContactsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total contacts" value={isLoading ? '—' : (stats?.total ?? 0)} icon={Contact} />
      <StatCard label="With email" value={isLoading ? '—' : (stats?.withEmail ?? 0)} icon={Mail} />
      <StatCard label="With phone" value={isLoading ? '—' : (stats?.withPhone ?? 0)} icon={Phone} />
      <StatCard label="With LinkedIn" value={isLoading ? '—' : (stats?.withLinkedIn ?? 0)} icon={Link2} />
    </div>
  )
}
