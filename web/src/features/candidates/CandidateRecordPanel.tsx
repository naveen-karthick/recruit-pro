import { User } from 'lucide-react'
import {
  InlineEditField,
  InlineEditMultiSelect,
  InlineEditSelect,
  RecordPanelHeader,
  RecordSection,
} from '@/components/data/InlineEditField'
import { useUsersQuery } from '@/hooks/useMasterData'
import type { UpdateCandidateInput } from '@/types'
import { candidateFullName, formatDateTime } from '@/types'
import { useCandidateQuery, useUpdateCandidateMutation } from './hooks'

interface CandidateRecordPanelProps {
  candidateId: string
}

export function CandidateRecordPanel({ candidateId }: CandidateRecordPanelProps) {
  const { data: candidate, isLoading } = useCandidateQuery(candidateId)
  const updateCandidate = useUpdateCandidateMutation()
  const { data: users = [] } = useUsersQuery()

  const patch = async (input: UpdateCandidateInput) => {
    await updateCandidate.mutateAsync({ id: candidateId, input })
  }

  if (isLoading || !candidate) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background text-sm text-muted-foreground">
        Loading candidate...
      </div>
    )
  }

  const ownerName = users.find((u) => u.id === candidate.ownerId)?.name ?? ''

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <RecordPanelHeader
        title={candidateFullName(candidate)}
        subtitle={candidate.currentJobTitle ?? undefined}
      />

      <div className="flex shrink-0 items-start gap-4 border-b border-border px-6 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-muted">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Created: {formatDateTime(candidate.createdAt)}</p>
          <p>Updated: {formatDateTime(candidate.updatedAt)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <RecordSection title="Personal">
          <InlineEditField label="First name" value={candidate.firstName} onSave={(v) => patch({ firstName: v })} />
          <InlineEditField label="Last name" value={candidate.lastName} onSave={(v) => patch({ lastName: v })} />
          <InlineEditField label="Gender" value={candidate.gender} onSave={(v) => patch({ gender: v || null })} />
          <InlineEditField
            label="Date of birth"
            type="date"
            value={candidate.dateOfBirth}
            onSave={(v) => patch({ dateOfBirth: v || null })}
          />
          <InlineEditField
            label="Nationality"
            value={candidate.nationality}
            onSave={(v) => patch({ nationality: v || null })}
          />
        </RecordSection>

        <RecordSection title="Contact">
          <InlineEditField
            label="Primary email"
            type="email"
            value={candidate.primaryEmail}
            onSave={(v) => patch({ primaryEmail: v || null })}
          />
          <InlineEditField
            label="Primary phone"
            value={candidate.primaryPhone}
            onSave={(v) => patch({ primaryPhone: v || null })}
          />
          <InlineEditField
            label="LinkedIn profile"
            value={candidate.linkedinProfile}
            onSave={(v) => patch({ linkedinProfile: v || null })}
          />
          <InlineEditField
            label="Current address"
            value={candidate.currentAddress}
            onSave={(v) => patch({ currentAddress: v || null })}
          />
        </RecordSection>

        <RecordSection title="Work">
          <InlineEditField
            label="Current company"
            value={candidate.currentCompany}
            onSave={(v) => patch({ currentCompany: v || null })}
          />
          <InlineEditField
            label="Current job title"
            value={candidate.currentJobTitle}
            onSave={(v) => patch({ currentJobTitle: v || null })}
          />
          <InlineEditField
            label="Total experience (years)"
            type="number"
            value={candidate.totalExperience}
            onSave={(v) => patch({ totalExperience: v ? Number(v) : null })}
          />
          <InlineEditField
            label="Expected salary"
            type="number"
            value={candidate.expectedSalary}
            onSave={(v) => patch({ expectedSalary: v ? Number(v) : null })}
          />
          <InlineEditField
            label="Availability date"
            type="date"
            value={candidate.availabilityDate}
            onSave={(v) => patch({ availabilityDate: v || null })}
          />
          <div className="sm:col-span-2">
            <InlineEditField
              label="Work summary"
              type="textarea"
              value={candidate.workSummary}
              onSave={(v) => patch({ workSummary: v || null })}
            />
          </div>
        </RecordSection>

        <RecordSection title="Classification">
          <InlineEditMultiSelect
            label="Skills"
            optionType="skills"
            value={candidate.skillIds}
            displayNames={candidate.skillNames}
            onSave={(ids) => patch({ skillIds: ids })}
          />
          <InlineEditMultiSelect
            label="Functional expertise"
            optionType="functional-expertise"
            value={candidate.functionalExpertiseIds}
            displayNames={candidate.functionalExpertiseNames}
            onSave={(ids) => patch({ functionalExpertiseIds: ids })}
          />
          <InlineEditMultiSelect
            label="Sub-functional expertise"
            optionType="sub-functional-expertise"
            value={candidate.subFunctionalExpertiseIds}
            displayNames={candidate.subFunctionalExpertiseNames}
            onSave={(ids) => patch({ subFunctionalExpertiseIds: ids })}
          />
          <InlineEditMultiSelect
            label="Keywords"
            optionType="keywords"
            value={candidate.keywordIds}
            displayNames={candidate.keywordNames}
            onSave={(ids) => patch({ keywordIds: ids })}
          />
          <InlineEditMultiSelect
            label="Industries"
            optionType="industries"
            value={candidate.industryIds}
            displayNames={candidate.industryNames}
            onSave={(ids) => patch({ industryIds: ids })}
          />
          <InlineEditMultiSelect
            label="Sub-industries"
            optionType="sub-industries"
            value={candidate.subIndustryIds}
            displayNames={candidate.subIndustryNames}
            onSave={(ids) => patch({ subIndustryIds: ids })}
          />
          <InlineEditSelect
            label="Owner"
            value={candidate.ownerId ?? ''}
            displayValue={ownerName}
            options={users}
            onSave={(v) => patch({ ownerId: v || null })}
          />
        </RecordSection>
      </div>
    </div>
  )
}
