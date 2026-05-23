import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSearch } from 'lucide-react'
import { TextField, TextAreaField } from '@/components/data/FormField'
import { AsyncMultiSelect, AsyncSingleSelect } from '@/components/data/AsyncMultiSelect'
import { EntityCreateModalShell } from '@/components/data/EntityCreateModalShell'
import { useCreateCandidateMutation } from './hooks'
import { candidateSchema, candidateDefaults, type CandidateFormValues } from './candidate-schema'

interface CandidateCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CandidateCreateModal({ open, onOpenChange }: CandidateCreateModalProps) {
  const createCandidate = useCreateCandidateMutation()

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: candidateDefaults,
  })

  const { register, formState: { errors }, watch, setValue, reset, handleSubmit } = form

  const handleOpenChange = (next: boolean) => {
    if (!next) reset(candidateDefaults)
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    await createCandidate.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender || null,
      dateOfBirth: values.dateOfBirth || null,
      primaryEmail: values.primaryEmail || null,
      primaryPhone: values.primaryPhone || null,
      linkedinProfile: values.linkedinProfile || null,
      currentAddress: values.currentAddress || null,
      nationality: values.nationality || null,
      workSummary: values.workSummary || null,
      currentCompany: values.currentCompany || null,
      currentJobTitle: values.currentJobTitle || null,
      totalExperience: values.totalExperience ?? null,
      expectedSalary: values.expectedSalary ?? null,
      availabilityDate: values.availabilityDate || null,
      skillIds: values.skillIds,
      functionalExpertiseIds: values.functionalExpertiseIds,
      subFunctionalExpertiseIds: values.subFunctionalExpertiseIds,
      keywordIds: values.keywordIds,
      industryIds: values.industryIds,
      subIndustryIds: values.subIndustryIds,
      ownerId: values.ownerId || null,
    })
    handleOpenChange(false)
  })

  return (
    <EntityCreateModalShell
      open={open}
      onOpenChange={handleOpenChange}
      icon={<UserSearch className="h-5 w-5 text-sky-600" />}
      title="New candidate"
      subtitle="EIREC candidate record"
      submitLabel="Create candidate"
      isSubmitting={createCandidate.isPending}
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="First name" name="firstName" register={register} error={errors.firstName} />
        <TextField label="Last name" name="lastName" register={register} error={errors.lastName} />
      </div>
      <TextField label="Primary email" name="primaryEmail" register={register} error={errors.primaryEmail} />
      <TextField label="Primary phone" name="primaryPhone" register={register} />
      <TextField label="Current job title" name="currentJobTitle" register={register} />
      <TextField label="Current company" name="currentCompany" register={register} />
      <TextAreaField label="Work summary" name="workSummary" register={register} error={errors.workSummary} />
      <AsyncMultiSelect label="Skills" optionType="skills" value={watch('skillIds')} onChange={(v) => setValue('skillIds', v)} />
      <AsyncMultiSelect label="Industries" optionType="industries" value={watch('industryIds')} onChange={(v) => setValue('industryIds', v)} />
      <AsyncMultiSelect label="Sub-industries" optionType="sub-industries" value={watch('subIndustryIds')} onChange={(v) => setValue('subIndustryIds', v)} />
      <AsyncMultiSelect label="Functional expertise" optionType="functional-expertise" value={watch('functionalExpertiseIds')} onChange={(v) => setValue('functionalExpertiseIds', v)} />
      <AsyncMultiSelect label="Keywords" optionType="keywords" value={watch('keywordIds')} onChange={(v) => setValue('keywordIds', v)} />
      <AsyncSingleSelect label="Owner" optionType="users" value={watch('ownerId') ?? ''} onChange={(v) => setValue('ownerId', v)} />
    </EntityCreateModalShell>
  )
}
