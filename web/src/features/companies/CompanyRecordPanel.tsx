import { Building2 } from 'lucide-react'
import {
  InlineEditField,
  InlineEditMultiSelect,
  InlineReadOnlyField,
  RecordPanelHeader,
  RecordSection,
} from '@/components/data/InlineEditField'
import type { RecordFrame } from '@/lib/record-drawer'
import type { UpdateCompanyInput } from '@/types'
import { formatDateTime } from '@/types'
import { useCompanyContactsQuery, useCompanyQuery, useUpdateCompanyMutation } from './hooks'

interface CompanyRecordPanelProps {
  companyId: string
  onNavigateRecord: (frame: RecordFrame) => void
}

export function CompanyRecordPanel({ companyId, onNavigateRecord }: CompanyRecordPanelProps) {
  const { data: company, isLoading } = useCompanyQuery(companyId)
  const { data: contacts = [] } = useCompanyContactsQuery(companyId)
  const updateCompany = useUpdateCompanyMutation()

  const patch = async (input: UpdateCompanyInput) => {
    await updateCompany.mutateAsync({ id: companyId, input })
  }

  const patchAddressField = async (field: string, value: string) => {
    if (!company?.addresses[0]) return
    const addr = { ...company.addresses[0], [field]: value || null }
    await patch({ addresses: [addr] })
  }

  if (isLoading || !company) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background text-sm text-muted-foreground">
        Loading company...
      </div>
    )
  }

  const addr = company.addresses[0]

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <RecordPanelHeader title={company.companyName} subtitle={`ID: ${company.id}`} />

      <div className="flex shrink-0 items-start gap-4 border-b border-border px-6 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-muted">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Created: {formatDateTime(company.createdAt)}</p>
          <p>Updated: {formatDateTime(company.updatedAt)}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <RecordSection title="Company details">
          <InlineEditField
            label="Company name"
            value={company.companyName}
            onSave={(v) => patch({ companyName: v })}
          />
          <InlineEditField
            label="Website"
            value={company.website}
            onSave={(v) => patch({ website: v || null })}
          />
          <InlineEditField
            label="LinkedIn URL"
            value={company.linkedinUrl}
            onSave={(v) => patch({ linkedinUrl: v || null })}
          />
          <InlineReadOnlyField label="Parent company" value={company.parentCompanyName} />
        </RecordSection>

        <RecordSection title="Classification">
          <InlineEditMultiSelect
            label="Industries"
            optionType="industries"
            value={company.industryIds}
            displayNames={company.industryNames}
            onSave={(ids) => patch({ industryIds: ids })}
          />
          <InlineEditMultiSelect
            label="Sub-industries"
            optionType="sub-industries"
            value={company.subIndustryIds}
            displayNames={company.subIndustryNames}
            onSave={(ids) => patch({ subIndustryIds: ids })}
          />
          <InlineEditMultiSelect
            label="Brands"
            optionType="brands"
            value={company.brandIds}
            displayNames={company.brandNames}
            onSave={(ids) => patch({ brandIds: ids })}
          />
          <InlineEditMultiSelect
            label="Owners"
            optionType="users"
            value={company.ownerIds}
            displayNames={[]}
            onSave={(ids) => patch({ ownerIds: ids })}
          />
        </RecordSection>

        <RecordSection title="Primary address">
          <InlineEditField
            label="Address line 1"
            value={addr?.addressLine1}
            onSave={(v) => patchAddressField('addressLine1', v)}
          />
          <InlineEditField
            label="Address line 2"
            value={addr?.addressLine2}
            onSave={(v) => patchAddressField('addressLine2', v)}
          />
          <InlineEditField label="City" value={addr?.city} onSave={(v) => patchAddressField('city', v)} />
          <InlineEditField label="State" value={addr?.state} onSave={(v) => patchAddressField('state', v)} />
          <InlineEditField label="Country" value={addr?.country} onSave={(v) => patchAddressField('country', v)} />
          <InlineEditField
            label="Postal code"
            value={addr?.postalCode}
            onSave={(v) => patchAddressField('postalCode', v)}
          />
          <InlineEditField label="Label" value={addr?.label} onSave={(v) => patchAddressField('label', v)} />
        </RecordSection>

        <section className="space-y-3">
          <h3 className="border-b border-border pb-1 text-[11px] font-bold uppercase tracking-wider">
            Contacts ({contacts.length})
          </h3>
          <div className="overflow-x-auto rounded border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-[11px] uppercase text-muted-foreground">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Job title</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-muted/20">
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        className="cursor-pointer text-sky-600 hover:underline"
                        onClick={() => onNavigateRecord({ type: 'contact', id: c.id })}
                      >
                        {c.firstName} {c.lastName}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{c.primaryEmail ?? '—'}</td>
                    <td className="px-3 py-2">{c.primaryPhone ?? '—'}</td>
                    <td className="px-3 py-2">{c.jobTitle ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">No contacts linked.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
