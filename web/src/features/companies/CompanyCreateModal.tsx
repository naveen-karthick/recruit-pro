import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { TextField } from '@/components/data/FormField'
import { AsyncMultiSelect } from '@/components/data/AsyncMultiSelect'
import { EntityCreateModalShell } from '@/components/data/EntityCreateModalShell'
import { useCreateCompanyMutation } from './hooks'
import { companySchema, companyDefaults, type CompanyFormValues } from './company-schema'

interface CompanyCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyCreateModal({ open, onOpenChange }: CompanyCreateModalProps) {
  const createCompany = useCreateCompanyMutation()

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: companyDefaults,
  })

  const { register, formState: { errors }, watch, setValue, reset, handleSubmit } = form

  const handleOpenChange = (next: boolean) => {
    if (!next) reset(companyDefaults)
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    await createCompany.mutateAsync({
      companyName: values.companyName,
      website: values.website || null,
      linkedinUrl: values.linkedinUrl || null,
      parentCompanyId: values.parentCompanyId || null,
      industryIds: values.industryIds,
      subIndustryIds: values.subIndustryIds,
      brandIds: values.brandIds,
      ownerIds: values.ownerIds,
      addresses: values.addresses.map((a) => ({
        ...a,
        addressLine2: a.addressLine2 || null,
        city: a.city || null,
        state: a.state || null,
        country: a.country || null,
        postalCode: a.postalCode || null,
        label: a.label || null,
      })),
    })
    handleOpenChange(false)
  })

  return (
    <EntityCreateModalShell
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Building2 className="h-5 w-5 text-sky-600" />}
      title="New company"
      subtitle="EIREC company record"
      submitLabel="Create company"
      isSubmitting={createCompany.isPending}
      onSubmit={onSubmit}
    >
      <TextField label="Company name" name="companyName" register={register} error={errors.companyName} />
      <TextField label="Website" name="website" register={register} error={errors.website} />
      <TextField label="LinkedIn URL" name="linkedinUrl" register={register} error={errors.linkedinUrl} />
      <AsyncMultiSelect label="Industries" optionType="industries" value={watch('industryIds')} onChange={(v) => setValue('industryIds', v)} />
      <AsyncMultiSelect label="Sub-industries" optionType="sub-industries" value={watch('subIndustryIds')} onChange={(v) => setValue('subIndustryIds', v)} />
      <AsyncMultiSelect label="Brands" optionType="brands" value={watch('brandIds')} onChange={(v) => setValue('brandIds', v)} />
      <AsyncMultiSelect label="Owners" optionType="users" value={watch('ownerIds')} onChange={(v) => setValue('ownerIds', v)} />
      <div className="rounded border border-border p-3 space-y-3">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Primary address</p>
        <TextField label="Address line 1" name="addresses.0.addressLine1" register={register} error={errors.addresses?.[0]?.addressLine1} />
        <TextField label="City" name="addresses.0.city" register={register} />
        <TextField label="Country" name="addresses.0.country" register={register} />
      </div>
    </EntityCreateModalShell>
  )
}
