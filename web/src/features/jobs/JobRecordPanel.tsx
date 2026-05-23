import { Briefcase } from 'lucide-react'
import {
  InlineEditField,
  InlineEditMultiSelect,
  InlineEditSelect,
  InlineReadOnlyField,
  RecordPanelHeader,
  RecordSection,
} from '@/components/data/InlineEditField'
import type { RecordFrame } from '@/lib/record-drawer'
import type { JobCategory, JobType, PermanentSubType, SalaryType, ForecastBy, UpdateJobInput } from '@/types'
import { formatDateTime } from '@/types'
import { useJobQuery, useUpdateJobMutation } from './hooks'

const JOB_CATEGORY_OPTIONS = [
  { id: 'JOB', name: 'Job' },
  { id: 'JOB_LEAD', name: 'Job lead' },
]

const JOB_TYPE_OPTIONS = [
  { id: 'PERMANENT', name: 'Permanent' },
  { id: 'INTERIM_PROJECT_CONSULTING', name: 'Interim / Project / Consulting' },
  { id: 'TEMPORARY', name: 'Temporary' },
  { id: 'CONTRACT', name: 'Contract' },
  { id: 'TEMP_TO_PERM', name: 'Temp to perm' },
]

const PERMANENT_SUBTYPE_OPTIONS = [
  { id: 'CONTINGENT', name: 'Contingent' },
  { id: 'RETAINED', name: 'Retained' },
  { id: 'EXCLUSIVE', name: 'Exclusive' },
]

const SALARY_TYPE_OPTIONS = [
  { id: 'MONTHLY', name: 'Monthly' },
  { id: 'ANNUAL', name: 'Annual' },
]

const FORECAST_BY_OPTIONS = [
  { id: 'MANUAL', name: 'Manual' },
  { id: 'HEADCOUNT', name: 'Headcount' },
  { id: 'ACTIVE_APPLICATIONS_MANUAL', name: 'Active applications (manual)' },
  { id: 'ACTIVE_APPLICATIONS_AUTO', name: 'Active applications (auto)' },
]

function enumLabel(options: { id: string; name: string }[], value: string | null | undefined) {
  return options.find((o) => o.id === value)?.name ?? value ?? ''
}

interface JobRecordPanelProps {
  jobId: string
  onNavigateRecord: (frame: RecordFrame) => void
}

export function JobRecordPanel({ jobId, onNavigateRecord }: JobRecordPanelProps) {
  const { data: job, isLoading } = useJobQuery(jobId)
  const updateJob = useUpdateJobMutation()

  const patch = async (input: UpdateJobInput) => {
    await updateJob.mutateAsync({ id: jobId, input })
  }

  if (isLoading || !job) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background text-sm text-muted-foreground">
        Loading job...
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <RecordPanelHeader title={job.jobTitle} subtitle={job.companyName ?? undefined} />

      <div className="flex shrink-0 items-start gap-4 border-b border-border px-6 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-muted">
          <Briefcase className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-xs text-muted-foreground">
          <p>
            Company:{' '}
            <button
              type="button"
              className="cursor-pointer text-sky-600 hover:underline"
              onClick={() => onNavigateRecord({ type: 'company', id: job.companyId })}
            >
              {job.companyName}
            </button>
          </p>
          {job.contactId && (
            <p>
              Contact:{' '}
              <button
                type="button"
                className="cursor-pointer text-sky-600 hover:underline"
                onClick={() => onNavigateRecord({ type: 'contact', id: job.contactId! })}
              >
                {job.contactName}
              </button>
            </p>
          )}
          <p>Created: {formatDateTime(job.createdAt)}</p>
          <p>Updated: {formatDateTime(job.updatedAt)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <RecordSection title="Job details">
          <InlineEditField label="Job title" value={job.jobTitle} onSave={(v) => patch({ jobTitle: v })} />
          <InlineEditSelect
            label="Job category"
            value={job.jobCategory ?? ''}
            displayValue={enumLabel(JOB_CATEGORY_OPTIONS, job.jobCategory)}
            options={JOB_CATEGORY_OPTIONS}
            onSave={(v) => patch({ jobCategory: (v || null) as JobCategory | null })}
          />
          <InlineEditSelect
            label="Job type"
            value={job.jobType ?? ''}
            displayValue={enumLabel(JOB_TYPE_OPTIONS, job.jobType)}
            options={JOB_TYPE_OPTIONS}
            onSave={(v) =>
              patch({
                jobType: (v || null) as JobType | null,
                permanentSubType: v === 'PERMANENT' ? job.permanentSubType : null,
              })
            }
          />
          {job.jobType === 'PERMANENT' && (
            <InlineEditSelect
              label="Permanent sub-type"
              value={job.permanentSubType ?? ''}
              displayValue={enumLabel(PERMANENT_SUBTYPE_OPTIONS, job.permanentSubType)}
              options={PERMANENT_SUBTYPE_OPTIONS}
              onSave={(v) => patch({ permanentSubType: (v || null) as PermanentSubType | null })}
            />
          )}
          <InlineEditField
            label="Head count"
            type="number"
            value={job.headCount}
            onSave={(v) => patch({ headCount: v ? Number(v) : null })}
          />
          <InlineReadOnlyField label="Job address" value={job.jobAddressDisplay} />
        </RecordSection>

        <RecordSection title="Location">
          <InlineEditField label="Country" value={job.country} onSave={(v) => patch({ country: v || null })} />
          <InlineEditField label="State" value={job.state} onSave={(v) => patch({ state: v || null })} />
        </RecordSection>

        <RecordSection title="Compensation">
          <InlineEditSelect
            label="Salary type"
            value={job.salaryType ?? ''}
            displayValue={enumLabel(SALARY_TYPE_OPTIONS, job.salaryType)}
            options={SALARY_TYPE_OPTIONS}
            onSave={(v) => patch({ salaryType: (v || null) as SalaryType | null })}
          />
          <InlineEditField
            label="Annual salary"
            type="number"
            value={job.annualSalary}
            onSave={(v) => patch({ annualSalary: v ? Number(v) : null })}
          />
          <InlineEditField
            label="Salary from"
            type="number"
            value={job.salaryFrom}
            onSave={(v) => patch({ salaryFrom: v ? Number(v) : null })}
          />
          <InlineEditField
            label="Salary to"
            type="number"
            value={job.salaryTo}
            onSave={(v) => patch({ salaryTo: v ? Number(v) : null })}
          />
          <InlineEditField label="Currency" value={job.currency} onSave={(v) => patch({ currency: v || null })} />
          <InlineEditField
            label="Months per year"
            type="number"
            value={job.monthsPerYear}
            onSave={(v) => patch({ monthsPerYear: v ? Number(v) : null })}
          />
        </RecordSection>

        <RecordSection title="Forecast">
          <InlineEditSelect
            label="Forecast by"
            value={job.forecastBy ?? ''}
            displayValue={enumLabel(FORECAST_BY_OPTIONS, job.forecastBy)}
            options={FORECAST_BY_OPTIONS}
            onSave={(v) => patch({ forecastBy: (v || null) as ForecastBy | null })}
          />
          <InlineEditField
            label="% of annual salary"
            type="number"
            value={job.percentOfAnnualSalary}
            onSave={(v) => patch({ percentOfAnnualSalary: v ? Number(v) : null })}
          />
          <InlineEditField
            label="Forecast fee"
            type="number"
            value={job.forecastFee}
            onSave={(v) => patch({ forecastFee: v ? Number(v) : null })}
          />
        </RecordSection>

        <RecordSection title="Classification">
          <InlineEditMultiSelect
            label="Functional expertise"
            optionType="functional-expertise"
            value={job.functionalExpertiseIds}
            displayNames={job.functionalExpertiseNames}
            onSave={(ids) => patch({ functionalExpertiseIds: ids })}
          />
          <InlineEditMultiSelect
            label="Sub-functional expertise"
            optionType="sub-functional-expertise"
            value={job.subFunctionalExpertiseIds}
            displayNames={job.subFunctionalExpertiseNames}
            onSave={(ids) => patch({ subFunctionalExpertiseIds: ids })}
          />
          <InlineEditMultiSelect
            label="Skills"
            optionType="skills"
            value={job.skillIds}
            displayNames={job.skillNames}
            onSave={(ids) => patch({ skillIds: ids })}
          />
          <InlineEditMultiSelect
            label="Keywords"
            optionType="keywords"
            value={job.keywordIds}
            displayNames={job.keywordNames}
            onSave={(ids) => patch({ keywordIds: ids })}
          />
          <InlineEditMultiSelect
            label="Owners"
            optionType="users"
            value={job.ownerIds}
            displayNames={[]}
            onSave={(ids) => patch({ ownerIds: ids })}
          />
        </RecordSection>
      </div>
    </div>
  )
}
