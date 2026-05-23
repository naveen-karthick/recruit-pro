# EIREC API — Endpoint Reference

Temporary MVP Node.js service backing the EIREC CRM UI. All routes are prefixed with `/api`.

Base URL (local): `http://localhost:3001/api`  
Base URL (production): `https://<your-api>.vercel.app/api`

---

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health check. Returns `{ "status": "ok" }`. |

---

## Field options (multi-select & dropdowns)

Used by `AsyncMultiSelect`, company dropdowns, and address pickers.

| Method | Path | Query params | Response |
|--------|------|--------------|----------|
| GET | `/options/industries` | — | `{ id, name }[]` |
| GET | `/options/sub-industries` | `parentId` (optional) | `{ id, name, industryId }[]` |
| GET | `/options/functional-expertise` | — | `{ id, name }[]` |
| GET | `/options/sub-functional-expertise` | `parentId` (optional) | `{ id, name, functionalExpertiseId }[]` |
| GET | `/options/skills` | — | `{ id, name }[]` |
| GET | `/options/keywords` | — | `{ id, name }[]` |
| GET | `/options/brands` | — | `{ id, name }[]` |
| GET | `/options/users` | — | `{ id, name }[]` (CRM owners) |
| GET | `/options/companies` | — | `{ id, name }[]` |
| GET | `/companies/:id/address-options` | — | `{ id, name }[]` |

### Legacy master routes (same data)

| Method | Path | Query params |
|--------|------|--------------|
| GET | `/master/industries` | — |
| GET | `/master/sub-industries` | `industryId` |
| GET | `/master/functional-expertise` | — |
| GET | `/master/sub-functional-expertise` | `functionalExpertiseId` |
| GET | `/master/skills` | — |
| GET | `/master/keywords` | — |
| GET | `/master/brands` | — |
| GET | `/master/users` | — |

---

## Companies

| Method | Path | Description |
|--------|------|-------------|
| GET | `/companies` | Paginated list. Query: `page`, `pageSize`, `search` |
| GET | `/companies/stats` | Dashboard stats |
| GET | `/companies/:id` | Single company (enriched with lookup names) |
| POST | `/companies` | Create company |
| PATCH | `/companies/:id` | Partial update (per-field inline edit) |
| DELETE | `/companies/:id` | Delete company |
| GET | `/companies/:id/contacts` | Contacts for company |
| GET | `/companies/:id/addresses` | Addresses for company |
| POST | `/companies/:id/addresses` | Add address to company |

### Create / update body (writable fields)

```json
{
  "companyName": "string (required on create)",
  "website": "string | null",
  "linkedinUrl": "string | null",
  "parentCompanyId": "uuid | null",
  "industryIds": ["uuid"],
  "subIndustryIds": ["uuid"],
  "brandIds": ["uuid"],
  "ownerIds": ["uuid"],
  "addresses": [{
    "id": "uuid (optional on update)",
    "addressLine1": "string (required)",
    "addressLine2": "string | null",
    "city": "string | null",
    "state": "string | null",
    "country": "string | null",
    "postalCode": "string | null",
    "label": "string | null"
  }]
}
```

Read-only on write: `id`, `industryNames`, `subIndustryNames`, `brandNames`, `parentCompanyName`, `createdAt`, `updatedAt`.

---

## Contacts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/contacts` | Paginated list. Query: `page`, `pageSize`, `search` |
| GET | `/contacts/stats` | Dashboard stats |
| GET | `/contacts/:id` | Single contact |
| POST | `/contacts` | Create contact |
| PATCH | `/contacts/:id` | Partial update |
| DELETE | `/contacts/:id` | Delete contact |

### Writable fields

`companyId`, `firstName`, `lastName`, `preferredName`, `jobTitle`, `primaryEmail`, `primaryPhone`, `linkedinProfile`, `industryIds`, `subIndustryIds`, `functionalExpertiseIds`, `subFunctionalExpertiseIds`, `ownerIds`, `workAddressId`

Required on create: `companyId`, `firstName`, `lastName`

---

## Jobs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/jobs` | Paginated list. Query: `page`, `pageSize`, `search` |
| GET | `/jobs/stats` | Dashboard stats |
| GET | `/jobs/:id` | Single job |
| POST | `/jobs` | Create job |
| PATCH | `/jobs/:id` | Partial update |
| DELETE | `/jobs/:id` | Delete job |

### Writable fields

`jobTitle`, `jobCategory`, `jobType`, `permanentSubType`, `headCount`, `companyId`, `contactId`, `country`, `state`, `jobAddressId`, `salaryType`, `monthsPerYear`, `annualSalary`, `salaryFrom`, `salaryTo`, `currency`, `forecastBy`, `percentOfAnnualSalary`, `forecastFee`, `functionalExpertiseIds`, `subFunctionalExpertiseIds`, `skillIds`, `keywordIds`, `ownerIds`

Required on create: `jobTitle`, `companyId`

### Enums

- **jobCategory**: `JOB`, `JOB_LEAD`
- **jobType**: `PERMANENT`, `INTERIM_PROJECT_CONSULTING`, `TEMPORARY`, `CONTRACT`, `TEMP_TO_PERM`
- **permanentSubType**: `CONTINGENT`, `RETAINED`, `EXCLUSIVE`
- **salaryType**: `MONTHLY`, `ANNUAL`
- **forecastBy**: `MANUAL`, `HEADCOUNT`, `ACTIVE_APPLICATIONS_MANUAL`, `ACTIVE_APPLICATIONS_AUTO`

---

## Candidates

| Method | Path | Description |
|--------|------|-------------|
| GET | `/candidates` | Paginated list. Query: `page`, `pageSize`, `search` |
| GET | `/candidates/stats` | Dashboard stats |
| GET | `/candidates/:id` | Single candidate |
| POST | `/candidates` | Create candidate |
| PATCH | `/candidates/:id` | Partial update |
| DELETE | `/candidates/:id` | Delete candidate |

### Writable fields

`firstName`, `lastName`, `gender`, `dateOfBirth`, `primaryEmail`, `primaryPhone`, `linkedinProfile`, `currentAddress`, `nationality`, `workSummary`, `currentCompany`, `currentJobTitle`, `totalExperience`, `expectedSalary`, `availabilityDate`, `skillIds`, `functionalExpertiseIds`, `subFunctionalExpertiseIds`, `keywordIds`, `industryIds`, `subIndustryIds`, `ownerId`

Required on create: `firstName`, `lastName`

---

## Addresses

| Method | Path | Description |
|--------|------|-------------|
| GET | `/addresses/:id` | Single address |
| PATCH | `/addresses/:id` | Update address |
| DELETE | `/addresses/:id` | Delete address |

---

## Quick search

| Method | Path | Query | Description |
|--------|------|-------|-------------|
| GET | `/search` | `q` | Cross-entity search (candidates, contacts, companies, jobs) |

Response shape:

```json
{
  "query": "string",
  "counts": { "candidates": 0, "contacts": 0, "companies": 0, "jobs": 0 },
  "results": {
    "candidates": [{ "entity": "candidates", "id", "name", "subtitle", "email", "phone" }],
    "contacts": [],
    "companies": [],
    "jobs": []
  }
}
```

---

## Pagination response

List endpoints return:

```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5
}
```

---

## Error responses

| Status | Body |
|--------|------|
| 400 | `{ "error": "message" }` |
| 404 | `{ "error": "message" }` |
| 500 | `{ "error": "Internal server error" }` |

---

## Frontend usage map

| UI feature | Endpoints |
|------------|-----------|
| Entity tables | `GET /{entity}?page&pageSize&search` |
| Overview stats | `GET /{entity}/stats` |
| Record panel view | `GET /{entity}/:id` |
| Inline field edit | `PATCH /{entity}/:id` with single field |
| Create modals | `POST /{entity}` |
| Multi-select fields | `GET /options/:type` |
| Company dropdown | `GET /options/companies` |
| Work/job address pickers | `GET /companies/:id/address-options` |
| Quick search (⌘K) | `GET /search?q=` |

---

## Notes for Spring Boot migration

This MVP service mirrors the EIREC DTO contract the UI expects today. When replacing with Spring Boot:

1. Keep the same URL paths and response shapes under `/api`
2. Preserve UUID primary keys and lookup ID arrays on entities
3. Enriched `*Names` fields are computed server-side (not stored)
4. PATCH semantics: partial updates; omit fields you do not want to change
5. Multi-select relation fields replace the entire set when included in PATCH body
