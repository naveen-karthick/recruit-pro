import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import { TextField } from '@/components/data/FormField'
import { AsyncMultiSelect, StaticSingleSelect } from '@/components/data/AsyncMultiSelect'
import { EntityCreateModalShell } from '@/components/data/EntityCreateModalShell'
import { useCompanyOptionsQuery } from '@/hooks/useMasterData'
import { useCreateContactMutation } from './hooks'
import { contactSchema, contactDefaults, type ContactFormValues } from './contact-schema'

interface ContactCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactCreateModal({ open, onOpenChange }: ContactCreateModalProps) {
  const createContact = useCreateContactMutation()
  const { data: companies = [], isLoading: companiesLoading } = useCompanyOptionsQuery(open)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaults,
  })

  const { register, formState: { errors }, watch, setValue, reset, handleSubmit } = form

  const handleOpenChange = (next: boolean) => {
    if (!next) reset(contactDefaults)
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    await createContact.mutateAsync({
      companyId: values.companyId,
      firstName: values.firstName,
      lastName: values.lastName,
      preferredName: values.preferredName || null,
      jobTitle: values.jobTitle || null,
      primaryEmail: values.primaryEmail || null,
      primaryPhone: values.primaryPhone || null,
      linkedinProfile: values.linkedinProfile || null,
      industryIds: values.industryIds,
      subIndustryIds: values.subIndustryIds,
      functionalExpertiseIds: values.functionalExpertiseIds,
      subFunctionalExpertiseIds: values.subFunctionalExpertiseIds,
      ownerIds: values.ownerIds,
      workAddressId: values.workAddressId || null,
    })
    handleOpenChange(false)
  })

  return (
    <EntityCreateModalShell
      open={open}
      onOpenChange={handleOpenChange}
      icon={<User className="h-5 w-5 text-sky-600" />}
      title="New contact"
      subtitle="EIREC contact record"
      submitLabel="Create contact"
      isSubmitting={createContact.isPending}
      onSubmit={onSubmit}
    >
      <StaticSingleSelect
        label="Company"
        options={companies}
        value={watch('companyId')}
        onChange={(v) => setValue('companyId', v)}
        isLoading={companiesLoading}
        allowEmpty={false}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="First name" name="firstName" register={register} error={errors.firstName} />
        <TextField label="Last name" name="lastName" register={register} error={errors.lastName} />
      </div>
      <TextField label="Job title" name="jobTitle" register={register} />
      <TextField label="Primary email" name="primaryEmail" register={register} error={errors.primaryEmail} />
      <TextField label="Primary phone" name="primaryPhone" register={register} />
      <AsyncMultiSelect label="Industries" optionType="industries" value={watch('industryIds')} onChange={(v) => setValue('industryIds', v)} />
      <AsyncMultiSelect label="Functional expertise" optionType="functional-expertise" value={watch('functionalExpertiseIds')} onChange={(v) => setValue('functionalExpertiseIds', v)} />
      <AsyncMultiSelect label="Sub-industries" optionType="sub-industries" value={watch('subIndustryIds')} onChange={(v) => setValue('subIndustryIds', v)} />
      <AsyncMultiSelect label="Sub-functional expertise" optionType="sub-functional-expertise" value={watch('subFunctionalExpertiseIds')} onChange={(v) => setValue('subFunctionalExpertiseIds', v)} />
      <AsyncMultiSelect label="Owners" optionType="users" value={watch('ownerIds')} onChange={(v) => setValue('ownerIds', v)} />
    </EntityCreateModalShell>
  )
}
