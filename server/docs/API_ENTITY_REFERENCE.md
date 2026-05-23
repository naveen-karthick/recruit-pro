# EIREC API — Simple Entity Reference

Base URL: `/api`  
All IDs are UUID strings. All timestamps are ISO-8601 (`2026-05-23T10:00:00.000Z`).

List endpoints return:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

Errors: `{ "error": "message" }` with status 400 / 404 / 500.

---

## Options API (dropdowns & multi-selects)

| GET endpoint | Query | Response | Used on |
|--------------|-------|----------|---------|
| `/api/options/industries` | — | `[{ "id", "name" }]` | **Companies**, **Contacts**, **Candidates** (create modal + record panel) |
| `/api/options/sub-industries` | `parentId` (optional) | `[{ "id", "name", "industryId" }]` | **Companies**, **Contacts**, **Candidates** |
| `/api/options/functional-expertise` | — | `[{ "id", "name" }]` | **Contacts**, **Jobs**, **Candidates** |
| `/api/options/sub-functional-expertise` | `parentId` (optional) | `[{ "id", "name", "functionalExpertiseId" }]` | **Contacts**, **Jobs**, **Candidates** |
| `/api/options/skills` | — | `[{ "id", "name" }]` | **Jobs**, **Candidates** |
| `/api/options/keywords` | — | `[{ "id", "name" }]` | **Jobs**, **Candidates** |
| `/api/options/brands` | — | `[{ "id", "name" }]` | **Companies** |
| `/api/options/users` | — | `[{ "id", "name" }]` | **Companies**, **Contacts**, **Jobs** (owners multi-select); **Candidates** (owner single-select) |
| `/api/options/companies` | — | `[{ "id", "name" }]` | **Contacts** create modal (company dropdown), **Jobs** create modal (company dropdown) |
| `/api/companies/{id}/address-options` | — | `[{ "id", "name" }]` | **Contacts** record panel (work address picker) |

---

## Health

### GET `/api/health`

**Response**
```json
{ "status": "ok" }
```

---

## Companies

### GET `/api/companies?page=1&pageSize=20&search=`

**Response** — paginated list of `Company`

### GET `/api/companies/stats`

**Response**
```json
{
  "total": 20,
  "withWebsite": 18,
  "withParent": 5,
  "totalAddresses": 25
}
```

### GET `/api/companies/{id}`

**Response** — single `Company`

### POST `/api/companies`

**Request**
```json
{
  "companyName": "Acme Corporation",
  "website": "https://www.acme.com",
  "linkedinUrl": "https://linkedin.com/company/acme",
  "parentCompanyId": null,
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "brandIds": ["uuid"],
  "ownerIds": ["uuid"],
  "addresses": [
    {
      "addressLine1": "100 Market Street",
      "addressLine2": "Suite 400",
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "postalCode": "94105",
      "label": "HQ"
    }
  ]
}
```

**Required:** `companyName`, `addresses` (at least one with `addressLine1`)

**Response** — `Company` (201)

### PATCH `/api/companies/{id}`

**Request** — any fields from POST (partial)

**Response** — `Company`

### DELETE `/api/companies/{id}`

**Response** — 204 empty

### GET `/api/companies/{id}/contacts`

**Response** — `Contact[]`

### GET `/api/companies/{id}/addresses`

**Response** — `Address[]`

### POST `/api/companies/{id}/addresses`

**Request**
```json
{
  "addressLine1": "100 Market Street",
  "addressLine2": null,
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94105",
  "label": "HQ"
}
```

**Response** — `Address` (201)

---

**Company response shape**
```json
{
  "id": "uuid",
  "companyName": "Acme Corporation",
  "addresses": [{ "id": "uuid", "addressLine1": "...", "addressLine2": null, "city": "...", "state": "...", "country": "...", "postalCode": "...", "label": "..." }],
  "industryIds": ["uuid"],
  "industryNames": ["Technology"],
  "subIndustryIds": ["uuid"],
  "subIndustryNames": ["SaaS"],
  "website": "https://www.acme.com",
  "linkedinUrl": "https://linkedin.com/company/acme",
  "parentCompanyId": null,
  "parentCompanyName": null,
  "brandIds": ["uuid"],
  "brandNames": ["Premium Partner"],
  "ownerIds": ["uuid"],
  "createdAt": "2026-05-23T10:00:00.000Z",
  "updatedAt": "2026-05-23T10:00:00.000Z"
}
```

---

## Contacts

### GET `/api/contacts?page=1&pageSize=20&search=`

**Response** — paginated list of `Contact`

### GET `/api/contacts/stats`

**Response**
```json
{
  "total": 40,
  "withEmail": 38,
  "withPhone": 35,
  "withLinkedIn": 30
}
```

### GET `/api/contacts/{id}`

**Response** — single `Contact`

### POST `/api/contacts`

**Request**
```json
{
  "companyId": "uuid",
  "firstName": "John",
  "lastName": "Smith",
  "preferredName": null,
  "jobTitle": "CTO",
  "primaryEmail": "john@acme.com",
  "primaryPhone": "+1-555-0100",
  "linkedinProfile": "https://linkedin.com/in/john-smith",
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "functionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseIds": ["uuid"],
  "ownerIds": ["uuid"],
  "workAddressId": "uuid"
}
```

**Required:** `companyId`, `firstName`, `lastName`

**Response** — `Contact` (201)

### PATCH `/api/contacts/{id}`

**Request** — partial fields from POST  
**Response** — `Contact`

### DELETE `/api/contacts/{id}`

**Response** — 204 empty

---

**Contact response shape**
```json
{
  "id": "uuid",
  "companyId": "uuid",
  "companyName": "Acme Corporation",
  "firstName": "John",
  "lastName": "Smith",
  "preferredName": null,
  "jobTitle": "CTO",
  "primaryEmail": "john@acme.com",
  "primaryPhone": "+1-555-0100",
  "linkedinProfile": "https://linkedin.com/in/john-smith",
  "industryIds": ["uuid"],
  "industryNames": ["Technology"],
  "subIndustryIds": ["uuid"],
  "subIndustryNames": ["SaaS"],
  "functionalExpertiseIds": ["uuid"],
  "functionalExpertiseNames": ["Engineering"],
  "subFunctionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseNames": ["Backend Development"],
  "ownerIds": ["uuid"],
  "workAddressId": "uuid",
  "workAddressDisplay": "100 Market Street, San Francisco, CA, USA",
  "createdAt": "2026-05-23T10:00:00.000Z",
  "updatedAt": "2026-05-23T10:00:00.000Z"
}
```

---

## Jobs

### GET `/api/jobs?page=1&pageSize=20&search=`

**Response** — paginated list of `Job`

### GET `/api/jobs/stats`

**Response**
```json
{
  "total": 20,
  "permanent": 8,
  "contract": 5,
  "jobLeads": 4
}
```

### GET `/api/jobs/{id}`

**Response** — single `Job`

### POST `/api/jobs`

**Request**
```json
{
  "jobTitle": "Senior Software Engineer",
  "jobCategory": "JOB",
  "jobType": "PERMANENT",
  "permanentSubType": "CONTINGENT",
  "headCount": 2,
  "companyId": "uuid",
  "contactId": "uuid",
  "country": "USA",
  "state": "CA",
  "jobAddressId": "uuid",
  "salaryType": "ANNUAL",
  "monthsPerYear": 12,
  "annualSalary": 150000,
  "salaryFrom": 120000,
  "salaryTo": 180000,
  "currency": "USD",
  "forecastBy": "MANUAL",
  "percentOfAnnualSalary": 20,
  "forecastFee": 30000,
  "functionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseIds": ["uuid"],
  "skillIds": ["uuid"],
  "keywordIds": ["uuid"],
  "ownerIds": ["uuid"]
}
```

**Required:** `jobTitle`, `companyId`

**Response** — `Job` (201)

### PATCH `/api/jobs/{id}`

**Request** — partial fields from POST  
**Response** — `Job`

### DELETE `/api/jobs/{id}`

**Response** — 204 empty

---

**Job response shape**
```json
{
  "id": "uuid",
  "jobTitle": "Senior Software Engineer",
  "jobCategory": "JOB",
  "jobType": "PERMANENT",
  "permanentSubType": "CONTINGENT",
  "headCount": 2,
  "companyId": "uuid",
  "companyName": "Acme Corporation",
  "contactId": "uuid",
  "contactName": "John Smith",
  "country": "USA",
  "state": "CA",
  "jobAddressId": "uuid",
  "jobAddressDisplay": "100 Market Street, San Francisco, CA, USA",
  "salaryType": "ANNUAL",
  "monthsPerYear": 12,
  "annualSalary": 150000,
  "salaryFrom": 120000,
  "salaryTo": 180000,
  "currency": "USD",
  "forecastBy": "MANUAL",
  "percentOfAnnualSalary": 20,
  "forecastFee": 30000,
  "functionalExpertiseIds": ["uuid"],
  "functionalExpertiseNames": ["Engineering"],
  "subFunctionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseNames": ["Backend Development"],
  "skillIds": ["uuid"],
  "skillNames": ["JavaScript", "React"],
  "keywordIds": ["uuid"],
  "keywordNames": ["Remote"],
  "ownerIds": ["uuid"],
  "createdAt": "2026-05-23T10:00:00.000Z",
  "updatedAt": "2026-05-23T10:00:00.000Z"
}
```

**Enums**

| Field | Values |
|-------|--------|
| `jobCategory` | `JOB`, `JOB_LEAD` |
| `jobType` | `PERMANENT`, `INTERIM_PROJECT_CONSULTING`, `TEMPORARY`, `CONTRACT`, `TEMP_TO_PERM` |
| `permanentSubType` | `CONTINGENT`, `RETAINED`, `EXCLUSIVE` |
| `salaryType` | `MONTHLY`, `ANNUAL` |
| `forecastBy` | `MANUAL`, `HEADCOUNT`, `ACTIVE_APPLICATIONS_MANUAL`, `ACTIVE_APPLICATIONS_AUTO` |

---

## Candidates

### GET `/api/candidates?page=1&pageSize=20&search=`

**Response** — paginated list of `Candidate`

### GET `/api/candidates/stats`

**Response**
```json
{
  "total": 25,
  "withLinkedIn": 22,
  "availableSoon": 15,
  "avgExperience": 7.5
}
```

### GET `/api/candidates/{id}`

**Response** — single `Candidate`

### POST `/api/candidates`

**Request**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "gender": "Female",
  "dateOfBirth": "1990-03-15",
  "primaryEmail": "jane@email.com",
  "primaryPhone": "+1-555-0200",
  "linkedinProfile": "https://linkedin.com/in/jane-doe",
  "currentAddress": "200 Main Street, Austin, TX",
  "nationality": "American",
  "workSummary": "Experienced engineer...",
  "currentCompany": "Acme Corporation",
  "currentJobTitle": "Engineer",
  "totalExperience": 8,
  "expectedSalary": 120000,
  "availabilityDate": "2026-06-01",
  "skillIds": ["uuid"],
  "functionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseIds": ["uuid"],
  "keywordIds": ["uuid"],
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "ownerId": "uuid"
}
```

**Required:** `firstName`, `lastName`

**Response** — `Candidate` (201)

### PATCH `/api/candidates/{id}`

**Request** — partial fields from POST  
**Response** — `Candidate`

### DELETE `/api/candidates/{id}`

**Response** — 204 empty

---

**Candidate response shape**
```json
{
  "id": "uuid",
  "firstName": "Jane",
  "lastName": "Doe",
  "gender": "Female",
  "dateOfBirth": "1990-03-15",
  "primaryEmail": "jane@email.com",
  "primaryPhone": "+1-555-0200",
  "linkedinProfile": "https://linkedin.com/in/jane-doe",
  "currentAddress": "200 Main Street, Austin, TX",
  "nationality": "American",
  "workSummary": "Experienced engineer...",
  "currentCompany": "Acme Corporation",
  "currentJobTitle": "Engineer",
  "totalExperience": 8,
  "expectedSalary": 120000,
  "availabilityDate": "2026-06-01",
  "skillIds": ["uuid"],
  "skillNames": ["JavaScript", "TypeScript"],
  "functionalExpertiseIds": ["uuid"],
  "functionalExpertiseNames": ["Engineering"],
  "subFunctionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseNames": ["Frontend Development"],
  "keywordIds": ["uuid"],
  "keywordNames": ["Remote"],
  "industryIds": ["uuid"],
  "industryNames": ["Technology"],
  "subIndustryIds": ["uuid"],
  "subIndustryNames": ["SaaS"],
  "ownerId": "uuid",
  "createdAt": "2026-05-23T10:00:00.000Z",
  "updatedAt": "2026-05-23T10:00:00.000Z"
}
```

---

## Addresses

### GET `/api/addresses/{id}`

**Response**
```json
{
  "id": "uuid",
  "addressLine1": "100 Market Street",
  "addressLine2": "Suite 400",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94105",
  "label": "HQ"
}
```

### PATCH `/api/addresses/{id}`

**Request** — partial address fields  
**Response** — `Address`

### DELETE `/api/addresses/{id}`

**Response** — 204 empty

---

## Quick Search (global ⌘K)

### GET `/api/search?q=john`

**Response**
```json
{
  "query": "john",
  "counts": {
    "candidates": 3,
    "contacts": 5,
    "companies": 1,
    "jobs": 2
  },
  "results": {
    "candidates": [
      { "entity": "candidates", "id": "uuid", "name": "John Smith", "subtitle": "Engineer", "email": "john@email.com", "phone": "+1-555-0100" }
    ],
    "contacts": [],
    "companies": [],
    "jobs": []
  }
}
```

Used on: **Quick Search** (top bar, all pages)

---

## Notes for backend dev

- `*Names` and `*Display` fields are **read-only** — computed on GET, ignored on POST/PATCH.
- PATCH with an ID array (e.g. `industryIds`) **replaces** the full set.
- POST/PATCH responses return the same shape as GET single entity.
