import { Briefcase, FileText, TrendingUp, UserPlus } from 'lucide-react'
import { StatCard } from '@/components/data/StatCard'
import type { JobStats } from '@/api/jobs'

interface JobsOverviewProps {
  stats?: JobStats
  isLoading?: boolean
}

export function JobsOverview({ stats, isLoading }: JobsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total jobs" value={isLoading ? '—' : (stats?.total ?? 0)} icon={Briefcase} />
      <StatCard label="Permanent" value={isLoading ? '—' : (stats?.permanent ?? 0)} icon={UserPlus} />
      <StatCard label="Contract" value={isLoading ? '—' : (stats?.contract ?? 0)} icon={FileText} />
      <StatCard label="Job leads" value={isLoading ? '—' : (stats?.jobLeads ?? 0)} icon={TrendingUp} />
    </div>
  )
}
