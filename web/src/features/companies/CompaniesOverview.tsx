import { Building2, Globe, Link2, MapPin } from 'lucide-react'
import { StatCard } from '@/components/data/StatCard'
import type { CompanyStats } from '@/api/companies'

interface CompaniesOverviewProps {
  stats?: CompanyStats
  isLoading?: boolean
}

export function CompaniesOverview({ stats, isLoading }: CompaniesOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total companies" value={isLoading ? '—' : (stats?.total ?? 0)} icon={Building2} />
      <StatCard label="With website" value={isLoading ? '—' : (stats?.withWebsite ?? 0)} icon={Globe} />
      <StatCard label="With parent company" value={isLoading ? '—' : (stats?.withParent ?? 0)} icon={Link2} />
      <StatCard label="Total addresses" value={isLoading ? '—' : (stats?.totalAddresses ?? 0)} icon={MapPin} />
    </div>
  )
}
