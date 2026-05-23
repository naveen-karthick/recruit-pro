import { z } from 'zod'

export const contactSchema = z.object({
  companyId: z.string().min(1, 'Company is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  preferredName: z.string().optional(),
  jobTitle: z.string().optional(),
  primaryEmail: z.string().email().optional().or(z.literal('')),
  primaryPhone: z.string().optional(),
  linkedinProfile: z.string().optional(),
  industryIds: z.array(z.string()),
  subIndustryIds: z.array(z.string()),
  functionalExpertiseIds: z.array(z.string()),
  subFunctionalExpertiseIds: z.array(z.string()),
  ownerIds: z.array(z.string()),
  workAddressId: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>

export const contactDefaults: ContactFormValues = {
  companyId: '',
  firstName: '',
  lastName: '',
  preferredName: '',
  jobTitle: '',
  primaryEmail: '',
  primaryPhone: '',
  linkedinProfile: '',
  industryIds: [],
  subIndustryIds: [],
  functionalExpertiseIds: [],
  subFunctionalExpertiseIds: [],
  ownerIds: [],
  workAddressId: '',
}
