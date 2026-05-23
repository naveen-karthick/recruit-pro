# EIREC CRM — Spring Boot API Blueprint

Contract specification for the React UI (`web/`). The temporary Node.js server implements this contract today. The Spring Boot backend **must match these paths, request bodies, and response shapes** so the UI works without changes.

**Base path:** `/api`  
**Content-Type:** `application/json`  
**IDs:** UUID strings (`550e8400-e29b-41d4-a716-446655440000`)  
**Timestamps:** ISO-8601 UTC strings (`2026-05-23T10:30:00.000Z`)

---

## Table of contents

1. [Conventions](#conventions)
2. [Health](#health)
3. [Lookup / options](#lookup--options)
4. [Companies](#companies)
5. [Contacts](#contacts)
6. [Jobs](#jobs)
7. [Candidates](#candidates)
8. [Addresses](#addresses)
9. [Quick search](#quick-search)
10. [Enums reference](#enums-reference)
11. [Spring Boot implementation notes](#spring-boot-implementation-notes)

---

## Conventions

### Pagination (list endpoints)

**Query parameters**

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `page` | integer | `1` | — | 1-based page number |
| `pageSize` | integer | `20` | `100` | Items per page |
| `search` | string | — | — | Case-insensitive filter across entity-specific fields |

**Response wrapper**

```json
{
  "data": [ /* entity[] */ ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

### PATCH semantics

- Partial update: only fields present in the body are updated.
- **Multi-select ID arrays** (`industryIds`, `skillIds`, etc.): when included in PATCH, the **entire set is replaced** (not merged).
- Omit a field → leave unchanged.
- Read-only / enriched fields sent in PATCH are **ignored**.

### Error responses

| HTTP | Body |
|------|------|
| 400 | `{ "error": "Human-readable message" }` |
| 404 | `{ "error": "Entity not found" }` |
| 500 | `{ "error": "Internal server error" }` |

### Enriched fields (read-only)

Responses include both **ID arrays** and parallel **name arrays** for lookups. Names are computed server-side and never stored on write:

| ID field | Name field |
|----------|------------|
| `industryIds` | `industryNames` |
| `subIndustryIds` | `subIndustryNames` |
| `brandIds` | `brandNames` |
| `functionalExpertiseIds` | `functionalExpertiseNames` |
| `subFunctionalExpertiseIds` | `subFunctionalExpertiseNames` |
| `skillIds` | `skillNames` |
| `keywordIds` | `keywordNames` |
| `ownerIds` | *(no names array on company/contact/job — UI resolves via options)* |
| `parentCompanyId` | `parentCompanyName` |
| `companyId` | `companyName` |
| `contactId` | `contactName` |
| `workAddressId` / `jobAddressId` | `workAddressDisplay` / `jobAddressDisplay` |

### CORS

UI is hosted separately. Allow the UI origin(s) or `*` for MVP.

---

## Health

### `GET /api/health`

**Response 200**

```json
{ "status": "ok" }
```

---

## Lookup / options

Used by multi-select dropdowns and company pickers.

### Master items (simple)

**Response:** `MasterItem[]`

```json
[
  { "id": "uuid", "name": "Technology" }
]
```

| Method | Path | Query | Used for |
|--------|------|-------|----------|
| GET | `/api/options/industries` | — | Industry multi-select |
| GET | `/api/options/functional-expertise` | — | Functional expertise |
| GET | `/api/options/skills` | — | Skills |
| GET | `/api/options/keywords` | — | Keywords |
| GET | `/api/options/brands` | — | Brands |
| GET | `/api/options/users` | — | Owner pickers |
| GET | `/api/options/companies` | — | Company dropdown |

### Master items (with parent filter)

| Method | Path | Query | Extra fields |
|--------|------|-------|--------------|
| GET | `/api/options/sub-industries` | `parentId` (optional UUID) | `industryId` |
| GET | `/api/options/sub-functional-expertise` | `parentId` (optional UUID) | `functionalExpertiseId` |

**Sub-industry example**

```json
[
  { "id": "uuid", "name": "SaaS", "industryId": "uuid" }
]
```

**Sub-functional expertise example**

```json
[
  { "id": "uuid", "name": "Backend Development", "functionalExpertiseId": "uuid" }
]
```

### Company address options

### `GET /api/companies/{id}/address-options`

**Response 200:** `OptionItem[]`

```json
[
  { "id": "uuid", "name": "HQ — 100 Market Street — San Francisco" }
]
```

`name` = joined `[label, addressLine1, city]` (non-empty parts).

### Legacy master routes (same data, alternate query param names)

| Method | Path | Query param |
|--------|------|-------------|
| GET | `/api/master/industries` | — |
| GET | `/api/master/sub-industries` | `industryId` |
| GET | `/api/master/functional-expertise` | — |
| GET | `/api/master/sub-functional-expertise` | `functionalExpertiseId` |
| GET | `/api/master/skills` | — |
| GET | `/api/master/keywords` | — |
| GET | `/api/master/brands` | — |
| GET | `/api/master/users` | — |

---

## Companies

### `GET /api/companies`

Paginated list. Search fields: `companyName`, `website`, `linkedinUrl`, `industryNames`, `subIndustryNames`, `brandNames`, `parentCompanyName`.

**Response 200:** `PaginatedResponse<Company>`

### `GET /api/companies/stats`

**Response 200**

```json
{
  "total": 20,
  "withWebsite": 18,
  "withParent": 5,
  "totalAddresses": 25
}
```

### `GET /api/companies/{id}`

**Response 200:** `Company`  
**Response 404:** `{ "error": "Company not found" }`

### `POST /api/companies`

**Required:** `companyName`, `addresses` (min 1 item with `addressLine1`)

**Request body:** `CreateCompanyRequest`

**Response 201:** `Company`

### `PATCH /api/companies/{id}`

**Request body:** partial `CreateCompanyRequest`  
**Response 200:** `Company`

### `DELETE /api/companies/{id}`

**Response 204:** empty body

### `GET /api/companies/{id}/contacts`

**Response 200:** `Contact[]` (not paginated)

### `GET /api/companies/{id}/addresses`

**Response 200:** `Address[]`

### `POST /api/companies/{id}/addresses`

**Required:** `addressLine1`  
**Response 201:** `Address`

---

### Company DTO

**Company (response)**

```json
{
  "id": "uuid",
  "companyName": "Acme Corporation",
  "addresses": [
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
  ],
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

**CreateCompanyRequest (write)**

```json
{
  "companyName": "string",
  "website": "string | null",
  "linkedinUrl": "string | null",
  "parentCompanyId": "uuid | null",
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "brandIds": ["uuid"],
  "ownerIds": ["uuid"],
  "addresses": [
    {
      "id": "uuid (optional, for update)",
      "addressLine1": "string",
      "addressLine2": "string | null",
      "city": "string | null",
      "state": "string | null",
      "country": "string | null",
      "postalCode": "string | null",
      "label": "string | null"
    }
  ]
}
```

---

## Contacts

### `GET /api/contacts`

Search fields: `firstName`, `lastName`, `preferredName`, `companyName`, `jobTitle`, `primaryEmail`, `primaryPhone`.

**Response 200:** `PaginatedResponse<Contact>`

### `GET /api/contacts/stats`

**Response 200**

```json
{
  "total": 40,
  "withEmail": 38,
  "withPhone": 35,
  "withLinkedIn": 30
}
```

### `GET /api/contacts/{id}`

**Response 200:** `Contact`

### `POST /api/contacts`

**Required:** `companyId`, `firstName`, `lastName`  
**Response 201:** `Contact`

### `PATCH /api/contacts/{id}`

**Response 200:** `Contact`

### `DELETE /api/contacts/{id}`

**Response 204**

---

### Contact DTO

**Contact (response)**

```json
{
  "id": "uuid",
  "companyId": "uuid",
  "companyName": "Acme Corporation",
  "firstName": "John",
  "lastName": "Smith",
  "preferredName": "Johnny",
  "jobTitle": "CTO",
  "primaryEmail": "john.smith@acme.com",
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
  "workAddressDisplay": "100 Market Street, Suite 400, San Francisco, CA, USA, 94105",
  "createdAt": "2026-05-23T10:00:00.000Z",
  "updatedAt": "2026-05-23T10:00:00.000Z"
}
```

**CreateContactRequest (write)**

```json
{
  "companyId": "uuid",
  "firstName": "string",
  "lastName": "string",
  "preferredName": "string | null",
  "jobTitle": "string | null",
  "primaryEmail": "string | null",
  "primaryPhone": "string | null",
  "linkedinProfile": "string | null",
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "functionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseIds": ["uuid"],
  "ownerIds": ["uuid"],
  "workAddressId": "uuid | null"
}
```

---

## Jobs

### `GET /api/jobs`

Search fields: `jobTitle`, `companyName`, `contactName`, `country`, `state`, `jobCategory`, `jobType`.

**Response 200:** `PaginatedResponse<Job>`

### `GET /api/jobs/stats`

**Response 200**

```json
{
  "total": 20,
  "permanent": 8,
  "contract": 5,
  "jobLeads": 4
}
```

### `GET /api/jobs/{id}`

**Response 200:** `Job`

### `POST /api/jobs`

**Required:** `jobTitle`, `companyId`  
**Response 201:** `Job`

### `PATCH /api/jobs/{id}`

**Response 200:** `Job`

### `DELETE /api/jobs/{id}`

**Response 204**

---

### Job DTO

**Job (response)**

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
  "jobAddressDisplay": "100 Market Street, San Francisco, CA, USA, 94105",
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

**CreateJobRequest (write)**

```json
{
  "jobTitle": "string",
  "jobCategory": "JOB | JOB_LEAD | null",
  "jobType": "PERMANENT | INTERIM_PROJECT_CONSULTING | TEMPORARY | CONTRACT | TEMP_TO_PERM | null",
  "permanentSubType": "CONTINGENT | RETAINED | EXCLUSIVE | null",
  "headCount": 1,
  "companyId": "uuid",
  "contactId": "uuid | null",
  "country": "string | null",
  "state": "string | null",
  "jobAddressId": "uuid | null",
  "salaryType": "MONTHLY | ANNUAL | null",
  "monthsPerYear": 12,
  "annualSalary": 150000,
  "salaryFrom": 120000,
  "salaryTo": 180000,
  "currency": "USD",
  "forecastBy": "MANUAL | HEADCOUNT | ACTIVE_APPLICATIONS_MANUAL | ACTIVE_APPLICATIONS_AUTO | null",
  "percentOfAnnualSalary": 20,
  "forecastFee": 30000,
  "functionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseIds": ["uuid"],
  "skillIds": ["uuid"],
  "keywordIds": ["uuid"],
  "ownerIds": ["uuid"]
}
```

**Note:** `permanentSubType` is only meaningful when `jobType` = `PERMANENT`. UI clears it otherwise.

---

## Candidates

### `GET /api/candidates`

Search fields: `firstName`, `lastName`, `primaryEmail`, `primaryPhone`, `currentCompany`, `currentJobTitle`, `nationality`.

**Response 200:** `PaginatedResponse<Candidate>`

### `GET /api/candidates/stats`

**Response 200**

```json
{
  "total": 25,
  "withLinkedIn": 22,
  "availableSoon": 15,
  "avgExperience": 7.5
}
```

### `GET /api/candidates/{id}`

**Response 200:** `Candidate`

### `POST /api/candidates`

**Required:** `firstName`, `lastName`  
**Response 201:** `Candidate`

### `PATCH /api/candidates/{id}`

**Response 200:** `Candidate`

### `DELETE /api/candidates/{id}`

**Response 204**

---

### Candidate DTO

**Candidate (response)**

```json
{
  "id": "uuid",
  "firstName": "Jane",
  "lastName": "Doe",
  "gender": "Female",
  "dateOfBirth": "1990-03-15",
  "primaryEmail": "jane.doe@email.com",
  "primaryPhone": "+1-555-0200",
  "linkedinProfile": "https://linkedin.com/in/jane-doe",
  "currentAddress": "200 Main Street, Austin, TX 78701",
  "nationality": "American",
  "workSummary": "Experienced engineer with 8 years in the industry.",
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

**CreateCandidateRequest (write)**

```json
{
  "firstName": "string",
  "lastName": "string",
  "gender": "string | null",
  "dateOfBirth": "string | null",
  "primaryEmail": "string | null",
  "primaryPhone": "string | null",
  "linkedinProfile": "string | null",
  "currentAddress": "string | null",
  "nationality": "string | null",
  "workSummary": "string | null",
  "currentCompany": "string | null",
  "currentJobTitle": "string | null",
  "totalExperience": 8.5,
  "expectedSalary": 120000,
  "availabilityDate": "2026-06-01",
  "skillIds": ["uuid"],
  "functionalExpertiseIds": ["uuid"],
  "subFunctionalExpertiseIds": ["uuid"],
  "keywordIds": ["uuid"],
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "ownerId": "uuid | null"
}
```

---

## Addresses

Standalone address CRUD (addresses also nested under companies).

### `GET /api/addresses/{id}`

**Response 200:** `Address`

### `PATCH /api/addresses/{id}`

**Request body:** partial address fields (no `id`)  
**Response 200:** `Address`

### `DELETE /api/addresses/{id}`

**Response 204**

**Address**

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

---

## Quick search

### `GET /api/search?q={query}`

Global search used by the ⌘K quick search bar. Returns up to **10 hits per entity type**.

**Response 200**

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
      {
        "entity": "candidates",
        "id": "uuid",
        "name": "John Smith",
        "subtitle": "Engineer",
        "email": "john@email.com",
        "phone": "+1-555-0100"
      }
    ],
    "contacts": [
      {
        "entity": "contacts",
        "id": "uuid",
        "name": "John Smith",
        "subtitle": "CTO — Acme Corporation",
        "email": "john.smith@acme.com",
        "phone": "+1-555-0100"
      }
    ],
    "companies": [
      {
        "entity": "companies",
        "id": "uuid",
        "name": "Acme Corporation",
        "subtitle": "Technology, SaaS",
        "email": "https://www.acme.com",
        "phone": ""
      }
    ],
    "jobs": [
      {
        "entity": "jobs",
        "id": "uuid",
        "name": "Senior Software Engineer",
        "subtitle": "Acme Corporation · CA",
        "email": "",
        "phone": ""
      }
    ]
  }
}
```

**Empty query (`q` blank):** same shape with zero counts and empty arrays.

---

## Enums reference

```java
// Java enum names suggested for Spring Boot

public enum JobCategory { JOB, JOB_LEAD }

public enum JobType {
  PERMANENT,
  INTERIM_PROJECT_CONSULTING,
  TEMPORARY,
  CONTRACT,
  TEMP_TO_PERM
}

public enum PermanentSubType { CONTINGENT, RETAINED, EXCLUSIVE }

public enum SalaryType { MONTHLY, ANNUAL }

public enum ForecastBy {
  MANUAL,
  HEADCOUNT,
  ACTIVE_APPLICATIONS_MANUAL,
  ACTIVE_APPLICATIONS_AUTO
}
```

---

## Spring Boot implementation notes

### Endpoint summary (44 routes)

| # | Method | Path |
|---|--------|------|
| 1 | GET | `/api/health` |
| 2 | GET | `/api/options/industries` |
| 3 | GET | `/api/options/sub-industries` |
| 4 | GET | `/api/options/functional-expertise` |
| 5 | GET | `/api/options/sub-functional-expertise` |
| 6 | GET | `/api/options/skills` |
| 7 | GET | `/api/options/keywords` |
| 8 | GET | `/api/options/brands` |
| 9 | GET | `/api/options/users` |
| 10 | GET | `/api/options/companies` |
| 11–18 | GET | `/api/master/*` (8 legacy routes) |
| 19 | GET | `/api/companies` |
| 20 | GET | `/api/companies/stats` |
| 21 | GET | `/api/companies/{id}` |
| 22 | POST | `/api/companies` |
| 23 | PATCH | `/api/companies/{id}` |
| 24 | DELETE | `/api/companies/{id}` |
| 25 | GET | `/api/companies/{id}/contacts` |
| 26 | GET | `/api/companies/{id}/addresses` |
| 27 | POST | `/api/companies/{id}/addresses` |
| 28 | GET | `/api/companies/{id}/address-options` |
| 29 | GET | `/api/contacts` |
| 30 | GET | `/api/contacts/stats` |
| 31 | GET | `/api/contacts/{id}` |
| 32 | POST | `/api/contacts` |
| 33 | PATCH | `/api/contacts/{id}` |
| 34 | DELETE | `/api/contacts/{id}` |
| 35 | GET | `/api/jobs` |
| 36 | GET | `/api/jobs/stats` |
| 37 | GET | `/api/jobs/{id}` |
| 38 | POST | `/api/jobs` |
| 39 | PATCH | `/api/jobs/{id}` |
| 40 | DELETE | `/api/jobs/{id}` |
| 41 | GET | `/api/candidates` |
| 42 | GET | `/api/candidates/stats` |
| 43 | GET | `/api/candidates/{id}` |
| 44 | POST | `/api/candidates` |
| 45 | PATCH | `/api/candidates/{id}` |
| 46 | DELETE | `/api/candidates/{id}` |
| 47 | GET | `/api/addresses/{id}` |
| 48 | PATCH | `/api/addresses/{id}` |
| 49 | DELETE | `/api/addresses/{id}` |
| 50 | GET | `/api/search` |

### Suggested package structure

```
com.eirec.api
├── controller/     # REST controllers per entity
├── dto/
│   ├── request/      # Create*Request, Update*Request
│   └── response/     # CompanyDto, ContactDto, PaginatedResponse, etc.
├── service/          # Business logic + enrichment
├── repository/     # JPA repositories
└── domain/           # JPA entities + join tables for multi-selects
```

### Data model hints

- **Lookup tables:** `Industry`, `SubIndustry`, `FunctionalExpertise`, `SubFunctionalExpertise`, `Skill`, `Keyword`, `Brand`, `CrmUser`
- **Core entities:** `Company`, `Contact`, `Job`, `Candidate`, `Address`
- **Join tables** for all `*Ids` many-to-many fields (see Node Prisma schema at `server/prisma/schema.prisma`)
- **Enrichment:** build `*Names` arrays in service layer from lookup tables; never persist on entity writes

### UI integration points

| UI feature | API call |
|------------|----------|
| Entity table | `GET /{entity}?page&pageSize&search` |
| Overview cards | `GET /{entity}/stats` |
| Record panel | `GET /{entity}/{id}` |
| Inline field edit | `PATCH /{entity}/{id}` (single field) |
| Create modal | `POST /{entity}` |
| Multi-select | `GET /api/options/{type}` |
| Company dropdown | `GET /api/options/companies` |
| Address picker | `GET /api/companies/{id}/address-options` |
| Quick search | `GET /api/search?q=` |

### Reference implementation

The working Node.js reference is in `server/`:
- Routes: `server/src/routes/`
- Response mapping: `server/src/services/mappers.ts`
- DB schema: `server/prisma/schema.prisma`

### Migration checklist

- [ ] All paths under `/api` match exactly
- [ ] UUID primary keys
- [ ] Response JSON field names match (camelCase)
- [ ] Enriched `*Names` fields on all GET responses
- [ ] PATCH partial update + full replace for ID arrays
- [ ] Pagination wrapper on all list endpoints
- [ ] Stats endpoints return exact field names
- [ ] Quick search response shape matches
- [ ] CORS configured for UI origin
- [ ] 400/404/500 error body `{ "error": "..." }`

---

*Generated from the EIREC Recruitment Portal MVP. Node reference: `server/docs/API.md`.*
