import { z } from 'zod'

const addressSchema = z.object({
  id: z.string().optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  label: z.string().optional(),
})

export const companySchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  website: z.string().optional(),
  linkedinUrl: z.string().optional(),
  parentCompanyId: z.string().optional(),
  industryIds: z.array(z.string()),
  subIndustryIds: z.array(z.string()),
  brandIds: z.array(z.string()),
  ownerIds: z.array(z.string()),
  addresses: z.array(addressSchema).min(1, 'At least one address is required'),
})

export type CompanyFormValues = z.infer<typeof companySchema>

export const companyDefaults: CompanyFormValues = {
  companyName: '',
  website: '',
  linkedinUrl: '',
  parentCompanyId: '',
  industryIds: [],
  subIndustryIds: [],
  brandIds: [],
  ownerIds: [],
  addresses: [
    {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      label: 'HQ',
    },
  ],
}

export { addressSchema }
