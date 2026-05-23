import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase } from 'lucide-react'
import { TextField, SelectField } from '@/components/data/FormField'
import { AsyncMultiSelect, StaticSingleSelect } from '@/components/data/AsyncMultiSelect'
import { EntityCreateModalShell } from '@/components/data/EntityCreateModalShell'
import { useCompanyOptionsQuery } from '@/hooks/useMasterData'
import { useCreateJobMutation } from './hooks'
import { jobSchema, jobDefaults, type JobFormValues } from './job-schema'

interface JobCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobCreateModal({ open, onOpenChange }: JobCreateModalProps) {
  const createJob = useCreateJobMutation()
  const { data: companies = [], isLoading: companiesLoading } = useCompanyOptionsQuery(open)

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: jobDefaults,
  })

  const { register, formState: { errors }, watch, setValue, reset, handleSubmit } = form

  const handleOpenChange = (next: boolean) => {
    if (!next) reset(jobDefaults)
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    await createJob.mutateAsync({
      jobTitle: values.jobTitle,
      jobCategory: values.jobCategory || null,
      jobType: values.jobType || null,
      permanentSubType: values.jobType === 'PERMANENT' ? values.permanentSubType || null : null,
      headCount: values.headCount ?? null,
      companyId: values.companyId,
      contactId: values.contactId || null,
      country: values.country || null,
      state: values.state || null,
      jobAddressId: values.jobAddressId || null,
      salaryType: values.salaryType || null,
      monthsPerYear: values.monthsPerYear ?? null,
      annualSalary: values.annualSalary ?? null,
      salaryFrom: values.salaryFrom ?? null,
      salaryTo: values.salaryTo ?? null,
      currency: values.currency || null,
      forecastBy: values.forecastBy || null,
      percentOfAnnualSalary: values.percentOfAnnualSalary ?? null,
      forecastFee: values.forecastFee ?? null,
      functionalExpertiseIds: values.functionalExpertiseIds,
      subFunctionalExpertiseIds: values.subFunctionalExpertiseIds,
      skillIds: values.skillIds,
      keywordIds: values.keywordIds,
      ownerIds: values.ownerIds,
    })
    handleOpenChange(false)
  })

  return (
    <EntityCreateModalShell
      open={open}
      onOpenChange={handleOpenChange}
      icon={<Briefcase className="h-5 w-5 text-sky-600" />}
      title="New job"
      subtitle="EIREC job record"
      submitLabel="Create job"
      isSubmitting={createJob.isPending}
      onSubmit={onSubmit}
    >
      <TextField label="Job title" name="jobTitle" register={register} error={errors.jobTitle} />
      <StaticSingleSelect
        label="Company"
        options={companies}
        value={watch('companyId')}
        onChange={(v) => setValue('companyId', v)}
        isLoading={companiesLoading}
        allowEmpty={false}
      />
      <SelectField
        label="Job category"
        value={watch('jobCategory') ?? ''}
        onChange={(v) => setValue('jobCategory', v as JobFormValues['jobCategory'])}
        options={[
          { value: 'JOB', label: 'Job' },
          { value: 'JOB_LEAD', label: 'Job lead' },
        ]}
      />
      <SelectField
        label="Job type"
        value={watch('jobType') ?? ''}
        onChange={(v) => setValue('jobType', v as JobFormValues['jobType'])}
        options={[
          { value: 'PERMANENT', label: 'Permanent' },
          { value: 'CONTRACT', label: 'Contract' },
          { value: 'TEMPORARY', label: 'Temporary' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Country" name="country" register={register} />
        <TextField label="State" name="state" register={register} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Salary from" name="salaryFrom" type="number" register={register} />
        <TextField label="Salary to" name="salaryTo" type="number" register={register} />
      </div>
      <TextField label="Currency" name="currency" register={register} />
      <AsyncMultiSelect label="Skills" optionType="skills" value={watch('skillIds')} onChange={(v) => setValue('skillIds', v)} />
      <AsyncMultiSelect label="Keywords" optionType="keywords" value={watch('keywordIds')} onChange={(v) => setValue('keywordIds', v)} />
      <AsyncMultiSelect label="Functional expertise" optionType="functional-expertise" value={watch('functionalExpertiseIds')} onChange={(v) => setValue('functionalExpertiseIds', v)} />
      <AsyncMultiSelect label="Sub-functional expertise" optionType="sub-functional-expertise" value={watch('subFunctionalExpertiseIds')} onChange={(v) => setValue('subFunctionalExpertiseIds', v)} />
      <AsyncMultiSelect label="Owners" optionType="users" value={watch('ownerIds')} onChange={(v) => setValue('ownerIds', v)} />
    </EntityCreateModalShell>
  )
}
