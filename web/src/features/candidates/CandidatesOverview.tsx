import { Calendar, Link2, Sparkles, UserSearch } from 'lucide-react'
import { StatCard } from '@/components/data/StatCard'
import type { CandidateStats } from '@/api/candidates'

interface CandidatesOverviewProps {
  stats?: CandidateStats
  isLoading?: boolean
}

export function CandidatesOverview({ stats, isLoading }: CandidatesOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total candidates" value={isLoading ? '—' : (stats?.total ?? 0)} icon={UserSearch} />
      <StatCard label="With LinkedIn" value={isLoading ? '—' : (stats?.withLinkedIn ?? 0)} icon={Link2} />
      <StatCard label="Available soon" value={isLoading ? '—' : (stats?.availableSoon ?? 0)} icon={Calendar} />
      <StatCard
        label="Avg. experience"
        value={isLoading ? '—' : `${stats?.avgExperience ?? 0} yrs`}
        icon={Sparkles}
      />
    </div>
  )
}
