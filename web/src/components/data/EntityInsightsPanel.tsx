import type { ReactNode } from 'react'
import { Activity, Briefcase, Building2, Sparkles, Target, Users } from 'lucide-react'
import type { CandidateStats } from '@/api/candidates'
import type { CompanyStats } from '@/api/companies'
import type { ContactStats } from '@/api/contacts'
import type { JobStats } from '@/api/jobs'
import { cn } from '@/lib/utils'

function InsightCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: {
  title: string
  description?: string
  icon: typeof Activity
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm', className)}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

function MetricRow({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border py-2.5 last:border-b-0">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground/80">{hint}</p>}
      </div>
      <span className="text-sm font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  )
}

function InsightsGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-3">{children}</div>
}

interface EntityInsightsProps {
  isLoading?: boolean
}

export function ContactsInsights({ stats, isLoading }: EntityInsightsProps & { stats?: ContactStats }) {
  return (
    <InsightsGrid>
      <InsightCard title="Contact coverage" icon={Users}>
        <MetricRow label="Total contacts" value={isLoading ? '—' : (stats?.total ?? 0)} />
        <MetricRow label="With email" value={isLoading ? '—' : (stats?.withEmail ?? 0)} />
        <MetricRow label="With phone" value={isLoading ? '—' : (stats?.withPhone ?? 0)} />
      </InsightCard>
      <InsightCard title="Digital presence" icon={Activity}>
        <MetricRow label="LinkedIn profiles" value={isLoading ? '—' : (stats?.withLinkedIn ?? 0)} />
      </InsightCard>
    </InsightsGrid>
  )
}

export function CompaniesInsights({ stats, isLoading }: EntityInsightsProps & { stats?: CompanyStats }) {
  return (
    <InsightsGrid>
      <InsightCard title="Portfolio" icon={Building2}>
        <MetricRow label="Total companies" value={isLoading ? '—' : (stats?.total ?? 0)} />
        <MetricRow label="With website" value={isLoading ? '—' : (stats?.withWebsite ?? 0)} />
        <MetricRow label="With parent company" value={isLoading ? '—' : (stats?.withParent ?? 0)} />
      </InsightCard>
      <InsightCard title="Addresses" icon={Target}>
        <MetricRow label="Total addresses" value={isLoading ? '—' : (stats?.totalAddresses ?? 0)} />
      </InsightCard>
    </InsightsGrid>
  )
}

export function CandidatesInsights({ stats, isLoading }: EntityInsightsProps & { stats?: CandidateStats }) {
  return (
    <InsightsGrid>
      <InsightCard title="Talent pool" icon={Sparkles}>
        <MetricRow label="Total candidates" value={isLoading ? '—' : (stats?.total ?? 0)} />
        <MetricRow label="Avg. experience" value={isLoading ? '—' : `${stats?.avgExperience ?? 0} yrs`} />
      </InsightCard>
      <InsightCard title="Availability" icon={Users}>
        <MetricRow label="With availability date" value={isLoading ? '—' : (stats?.availableSoon ?? 0)} />
        <MetricRow label="With LinkedIn" value={isLoading ? '—' : (stats?.withLinkedIn ?? 0)} />
      </InsightCard>
    </InsightsGrid>
  )
}

export function JobsInsights({ stats, isLoading }: EntityInsightsProps & { stats?: JobStats }) {
  return (
    <InsightsGrid>
      <InsightCard title="Requisitions" icon={Briefcase}>
        <MetricRow label="Total jobs" value={isLoading ? '—' : (stats?.total ?? 0)} />
        <MetricRow label="Permanent" value={isLoading ? '—' : (stats?.permanent ?? 0)} />
        <MetricRow label="Contract" value={isLoading ? '—' : (stats?.contract ?? 0)} />
      </InsightCard>
      <InsightCard title="Pipeline" icon={Target}>
        <MetricRow label="Job leads" value={isLoading ? '—' : (stats?.jobLeads ?? 0)} />
      </InsightCard>
    </InsightsGrid>
  )
}
