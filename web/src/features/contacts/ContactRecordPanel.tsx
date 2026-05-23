import { User } from 'lucide-react'
import {
  InlineEditField,
  InlineEditMultiSelect,
  InlineEditSelect,
  RecordPanelHeader,
  RecordSection,
} from '@/components/data/InlineEditField'
import { useCompanyAddressOptionsQuery } from '@/hooks/useMasterData'
import type { RecordFrame } from '@/lib/record-drawer'
import type { UpdateContactInput } from '@/types'
import { contactFullName, formatDateTime } from '@/types'
import { useContactQuery, useUpdateContactMutation } from './hooks'

interface ContactRecordPanelProps {
  contactId: string
  onNavigateRecord: (frame: RecordFrame) => void
}

export function ContactRecordPanel({ contactId, onNavigateRecord }: ContactRecordPanelProps) {
  const { data: contact, isLoading } = useContactQuery(contactId)
  const updateContact = useUpdateContactMutation()
  const { data: addressOptions = [], isLoading: addressesLoading } = useCompanyAddressOptionsQuery(
    contact?.companyId,
  )

  const patch = async (input: UpdateContactInput) => {
    await updateContact.mutateAsync({ id: contactId, input })
  }

  if (isLoading || !contact) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background text-sm text-muted-foreground">
        Loading contact...
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <RecordPanelHeader
        title={contactFullName(contact)}
        subtitle={contact.companyName ?? undefined}
      />

      <div className="flex shrink-0 items-start gap-4 border-b border-border px-6 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-muted">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-xs text-muted-foreground">
          <p>
            Company:{' '}
            <button
              type="button"
              className="cursor-pointer text-sky-600 hover:underline"
              onClick={() => onNavigateRecord({ type: 'company', id: contact.companyId })}
            >
              {contact.companyName}
            </button>
          </p>
          <p>Created: {formatDateTime(contact.createdAt)}</p>
          <p>Updated: {formatDateTime(contact.updatedAt)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <RecordSection title="Personal">
          <InlineEditField
            label="First name"
            value={contact.firstName}
            onSave={(v) => patch({ firstName: v })}
          />
          <InlineEditField
            label="Last name"
            value={contact.lastName}
            onSave={(v) => patch({ lastName: v })}
          />
          <InlineEditField
            label="Preferred name"
            value={contact.preferredName}
            onSave={(v) => patch({ preferredName: v || null })}
          />
          <InlineEditField
            label="Job title"
            value={contact.jobTitle}
            onSave={(v) => patch({ jobTitle: v || null })}
          />
        </RecordSection>

        <RecordSection title="Contact info">
          <InlineEditField
            label="Primary email"
            type="email"
            value={contact.primaryEmail}
            onSave={(v) => patch({ primaryEmail: v || null })}
          />
          <InlineEditField
            label="Primary phone"
            value={contact.primaryPhone}
            onSave={(v) => patch({ primaryPhone: v || null })}
          />
          <InlineEditField
            label="LinkedIn profile"
            value={contact.linkedinProfile}
            onSave={(v) => patch({ linkedinProfile: v || null })}
          />
          <InlineEditSelect
            label="Work address"
            value={contact.workAddressId ?? ''}
            displayValue={contact.workAddressDisplay ?? ''}
            options={addressOptions}
            isLoading={addressesLoading}
            onSave={(v) => patch({ workAddressId: v || null })}
          />
        </RecordSection>

        <RecordSection title="Classification">
          <InlineEditMultiSelect
            label="Industries"
            optionType="industries"
            value={contact.industryIds}
            displayNames={contact.industryNames}
            onSave={(ids) => patch({ industryIds: ids })}
          />
          <InlineEditMultiSelect
            label="Sub-industries"
            optionType="sub-industries"
            value={contact.subIndustryIds}
            displayNames={contact.subIndustryNames}
            onSave={(ids) => patch({ subIndustryIds: ids })}
          />
          <InlineEditMultiSelect
            label="Functional expertise"
            optionType="functional-expertise"
            value={contact.functionalExpertiseIds}
            displayNames={contact.functionalExpertiseNames}
            onSave={(ids) => patch({ functionalExpertiseIds: ids })}
          />
          <InlineEditMultiSelect
            label="Sub-functional expertise"
            optionType="sub-functional-expertise"
            value={contact.subFunctionalExpertiseIds}
            displayNames={contact.subFunctionalExpertiseNames}
            onSave={(ids) => patch({ subFunctionalExpertiseIds: ids })}
          />
          <InlineEditMultiSelect
            label="Owners"
            optionType="users"
            value={contact.ownerIds}
            displayNames={[]}
            onSave={(ids) => patch({ ownerIds: ids })}
          />
        </RecordSection>
      </div>
    </div>
  )
}
