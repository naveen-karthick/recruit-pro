import { z } from 'zod'

export const jobSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  jobCategory: z.enum(['JOB', 'JOB_LEAD']).optional().or(z.literal('')),
  jobType: z
    .enum(['PERMANENT', 'INTERIM_PROJECT_CONSULTING', 'TEMPORARY', 'CONTRACT', 'TEMP_TO_PERM'])
    .optional()
    .or(z.literal('')),
  permanentSubType: z.enum(['CONTINGENT', 'RETAINED', 'EXCLUSIVE']).optional().or(z.literal('')),
  headCount: z.number().optional(),
  companyId: z.string().min(1, 'Company is required'),
  contactId: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  jobAddressId: z.string().optional(),
  salaryType: z.enum(['MONTHLY', 'ANNUAL']).optional().or(z.literal('')),
  monthsPerYear: z.number().optional(),
  annualSalary: z.number().optional(),
  salaryFrom: z.number().optional(),
  salaryTo: z.number().optional(),
  currency: z.string().optional(),
  forecastBy: z
    .enum(['MANUAL', 'HEADCOUNT', 'ACTIVE_APPLICATIONS_MANUAL', 'ACTIVE_APPLICATIONS_AUTO'])
    .optional()
    .or(z.literal('')),
  percentOfAnnualSalary: z.number().optional(),
  forecastFee: z.number().optional(),
  functionalExpertiseIds: z.array(z.string()),
  subFunctionalExpertiseIds: z.array(z.string()),
  skillIds: z.array(z.string()),
  keywordIds: z.array(z.string()),
  ownerIds: z.array(z.string()),
})

export type JobFormValues = z.infer<typeof jobSchema>

export const jobDefaults: JobFormValues = {
  jobTitle: '',
  jobCategory: '',
  jobType: '',
  permanentSubType: '',
  headCount: 1,
  companyId: '',
  contactId: '',
  country: '',
  state: '',
  jobAddressId: '',
  salaryType: 'ANNUAL',
  monthsPerYear: 12,
  annualSalary: undefined,
  salaryFrom: undefined,
  salaryTo: undefined,
  currency: 'USD',
  forecastBy: 'MANUAL',
  percentOfAnnualSalary: undefined,
  forecastFee: undefined,
  functionalExpertiseIds: [],
  subFunctionalExpertiseIds: [],
  skillIds: [],
  keywordIds: [],
  ownerIds: [],
}
