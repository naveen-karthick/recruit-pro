import type { PrismaClient } from '@prisma/client'

async function execStatements(prisma: PrismaClient, statements: string[]) {
  for (const statement of statements) {
    await prisma.$executeRawUnsafe(statement)
  }
}

/**
 * Adds PostgreSQL tsvector columns, refresh functions, GIN indexes, and triggers
 * so quick search can match direct entity fields plus related lookup names
 * (functional / sub-functional expertise, skills, keywords, etc.).
 *
 * Idempotent — safe to run on every seed.
 */
export async function setupSearchVectors(prisma: PrismaClient) {
  console.log('Setting up search vectors...')

  await execStatements(prisma, [
    `ALTER TABLE candidates ADD COLUMN IF NOT EXISTS search_vector tsvector`,
    `ALTER TABLE contacts ADD COLUMN IF NOT EXISTS search_vector tsvector`,
    `ALTER TABLE companies ADD COLUMN IF NOT EXISTS search_vector tsvector`,
    `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS search_vector tsvector`,
  ])

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION refresh_candidate_search_vector(p_candidate_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      search_text text;
    BEGIN
      SELECT trim(both ' ' FROM concat_ws(' ',
        c."firstName",
        c."lastName",
        c."primaryEmail",
        c."primaryPhone",
        c."linkedinProfile",
        c."currentAddress",
        c."nationality",
        c."workSummary",
        c."currentCompany",
        c."currentJobTitle",
        (SELECT string_agg(fe.name, ' ')
         FROM candidate_functional_expertise cfe
         JOIN functional_expertise fe ON fe.id = cfe."functionalExpertiseId"
         WHERE cfe."candidateId" = c.id),
        (SELECT string_agg(sfe.name, ' ')
         FROM candidate_sub_functional_expertise csfe
         JOIN sub_functional_expertise sfe ON sfe.id = csfe."subFunctionalExpertiseId"
         WHERE csfe."candidateId" = c.id),
        (SELECT string_agg(s.name, ' ')
         FROM candidate_skills cs
         JOIN skills s ON s.id = cs."skillId"
         WHERE cs."candidateId" = c.id),
        (SELECT string_agg(k.name, ' ')
         FROM candidate_keywords ck
         JOIN keywords k ON k.id = ck."keywordId"
         WHERE ck."candidateId" = c.id),
        (SELECT string_agg(i.name, ' ')
         FROM candidate_industries ci
         JOIN industries i ON i.id = ci."industryId"
         WHERE ci."candidateId" = c.id),
        (SELECT string_agg(si.name, ' ')
         FROM candidate_sub_industries csi
         JOIN sub_industries si ON si.id = csi."subIndustryId"
         WHERE csi."candidateId" = c.id)
      ))
      INTO search_text
      FROM candidates c
      WHERE c.id = p_candidate_id;

      IF search_text IS NULL THEN
        RETURN;
      END IF;

      UPDATE candidates
      SET search_vector = to_tsvector('simple', search_text)
      WHERE id = p_candidate_id;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION refresh_contact_search_vector(p_contact_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      search_text text;
    BEGIN
      SELECT trim(both ' ' FROM concat_ws(' ',
        ct."firstName",
        ct."lastName",
        ct."preferredName",
        ct."jobTitle",
        ct."primaryEmail",
        ct."primaryPhone",
        ct."linkedinProfile",
        co."companyName",
        (SELECT string_agg(fe.name, ' ')
         FROM contact_functional_expertise cfe
         JOIN functional_expertise fe ON fe.id = cfe."functionalExpertiseId"
         WHERE cfe."contactId" = ct.id),
        (SELECT string_agg(sfe.name, ' ')
         FROM contact_sub_functional_expertise csfe
         JOIN sub_functional_expertise sfe ON sfe.id = csfe."subFunctionalExpertiseId"
         WHERE csfe."contactId" = ct.id),
        (SELECT string_agg(i.name, ' ')
         FROM contact_industries ci
         JOIN industries i ON i.id = ci."industryId"
         WHERE ci."contactId" = ct.id),
        (SELECT string_agg(si.name, ' ')
         FROM contact_sub_industries csi
         JOIN sub_industries si ON si.id = csi."subIndustryId"
         WHERE csi."contactId" = ct.id)
      ))
      INTO search_text
      FROM contacts ct
      LEFT JOIN companies co ON co.id = ct."companyId"
      WHERE ct.id = p_contact_id;

      IF search_text IS NULL THEN
        RETURN;
      END IF;

      UPDATE contacts
      SET search_vector = to_tsvector('simple', search_text)
      WHERE id = p_contact_id;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION refresh_company_search_vector(p_company_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      search_text text;
    BEGIN
      SELECT trim(both ' ' FROM concat_ws(' ',
        co."companyName",
        co.website,
        co."linkedinUrl",
        (SELECT string_agg(a."addressLine1", ' ')
         FROM addresses a
         WHERE a."companyId" = co.id),
        (SELECT string_agg(a."addressLine2", ' ')
         FROM addresses a
         WHERE a."companyId" = co.id),
        (SELECT string_agg(a.city, ' ')
         FROM addresses a
         WHERE a."companyId" = co.id),
        (SELECT string_agg(a.state, ' ')
         FROM addresses a
         WHERE a."companyId" = co.id),
        (SELECT string_agg(a.country, ' ')
         FROM addresses a
         WHERE a."companyId" = co.id),
        (SELECT string_agg(a."postalCode", ' ')
         FROM addresses a
         WHERE a."companyId" = co.id),
        (SELECT string_agg(i.name, ' ')
         FROM company_industries ci
         JOIN industries i ON i.id = ci."industryId"
         WHERE ci."companyId" = co.id),
        (SELECT string_agg(si.name, ' ')
         FROM company_sub_industries csi
         JOIN sub_industries si ON si.id = csi."subIndustryId"
         WHERE csi."companyId" = co.id),
        (SELECT string_agg(b.name, ' ')
         FROM company_brands cb
         JOIN brands b ON b.id = cb."brandId"
         WHERE cb."companyId" = co.id),
        parent_co."companyName"
      ))
      INTO search_text
      FROM companies co
      LEFT JOIN companies parent_co ON parent_co.id = co."parentCompanyId"
      WHERE co.id = p_company_id;

      IF search_text IS NULL THEN
        RETURN;
      END IF;

      UPDATE companies
      SET search_vector = to_tsvector('simple', search_text)
      WHERE id = p_company_id;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION refresh_job_search_vector(p_job_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      search_text text;
    BEGIN
      SELECT trim(both ' ' FROM concat_ws(' ',
        j."jobTitle",
        j.country,
        j.state,
        co."companyName",
        ct."firstName",
        ct."lastName",
        (SELECT string_agg(fe.name, ' ')
         FROM job_functional_expertise jfe
         JOIN functional_expertise fe ON fe.id = jfe."functionalExpertiseId"
         WHERE jfe."jobId" = j.id),
        (SELECT string_agg(sfe.name, ' ')
         FROM job_sub_functional_expertise jsfe
         JOIN sub_functional_expertise sfe ON sfe.id = jsfe."subFunctionalExpertiseId"
         WHERE jsfe."jobId" = j.id),
        (SELECT string_agg(s.name, ' ')
         FROM job_skills js
         JOIN skills s ON s.id = js."skillId"
         WHERE js."jobId" = j.id),
        (SELECT string_agg(k.name, ' ')
         FROM job_keywords jk
         JOIN keywords k ON k.id = jk."keywordId"
         WHERE jk."jobId" = j.id)
      ))
      INTO search_text
      FROM jobs j
      LEFT JOIN companies co ON co.id = j."companyId"
      LEFT JOIN contacts ct ON ct.id = j."contactId"
      WHERE j.id = p_job_id;

      IF search_text IS NULL THEN
        RETURN;
      END IF;

      UPDATE jobs
      SET search_vector = to_tsvector('simple', search_text)
      WHERE id = p_job_id;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION refresh_all_search_vectors()
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
      r record;
    BEGIN
      FOR r IN SELECT id FROM candidates LOOP
        PERFORM refresh_candidate_search_vector(r.id);
      END LOOP;

      FOR r IN SELECT id FROM contacts LOOP
        PERFORM refresh_contact_search_vector(r.id);
      END LOOP;

      FOR r IN SELECT id FROM companies LOOP
        PERFORM refresh_company_search_vector(r.id);
      END LOOP;

      FOR r IN SELECT id FROM jobs LOOP
        PERFORM refresh_job_search_vector(r.id);
      END LOOP;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_candidate_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_candidate_search_vector(COALESCE(NEW."candidateId", OLD."candidateId"));
      RETURN COALESCE(NEW, OLD);
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_candidate_row_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_candidate_search_vector(NEW.id);
      RETURN NEW;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_contact_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_contact_search_vector(COALESCE(NEW."contactId", OLD."contactId"));
      RETURN COALESCE(NEW, OLD);
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_contact_row_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_contact_search_vector(NEW.id);
      RETURN NEW;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_company_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_company_search_vector(COALESCE(NEW."companyId", OLD."companyId"));
      RETURN COALESCE(NEW, OLD);
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_company_row_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_company_search_vector(NEW.id);
      RETURN NEW;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_job_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_job_search_vector(COALESCE(NEW."jobId", OLD."jobId"));
      RETURN COALESCE(NEW, OLD);
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_job_row_search_vector()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_job_search_vector(NEW.id);
      RETURN NEW;
    END;
    $$;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION trigger_refresh_contacts_for_company()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM refresh_contact_search_vector(ct.id)
      FROM contacts ct
      WHERE ct."companyId" = COALESCE(NEW.id, OLD.id);
      RETURN COALESCE(NEW, OLD);
    END;
    $$;
  `)

  const triggerSpecs: Array<{ table: string; name: string; fn: string; events: string; updateColumns?: string }> = [
    {
      table: 'candidates',
      name: 'candidates_search_vector_row_trg',
      fn: 'trigger_refresh_candidate_row_search_vector',
      events: 'INSERT OR UPDATE',
      updateColumns: `"firstName", "lastName", gender, "dateOfBirth", "primaryEmail", "primaryPhone", "linkedinProfile", "currentAddress", nationality, "workSummary", "currentCompany", "currentJobTitle", "totalExperience", "expectedSalary", "availabilityDate", "ownerId"`,
    },
    { table: 'candidate_functional_expertise', name: 'candidate_fe_search_vector_trg', fn: 'trigger_refresh_candidate_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'candidate_sub_functional_expertise', name: 'candidate_sfe_search_vector_trg', fn: 'trigger_refresh_candidate_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'candidate_skills', name: 'candidate_skills_search_vector_trg', fn: 'trigger_refresh_candidate_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'candidate_keywords', name: 'candidate_keywords_search_vector_trg', fn: 'trigger_refresh_candidate_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'candidate_industries', name: 'candidate_industries_search_vector_trg', fn: 'trigger_refresh_candidate_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'candidate_sub_industries', name: 'candidate_sub_industries_search_vector_trg', fn: 'trigger_refresh_candidate_search_vector', events: 'INSERT OR UPDATE OR DELETE' },

    {
      table: 'contacts',
      name: 'contacts_search_vector_row_trg',
      fn: 'trigger_refresh_contact_row_search_vector',
      events: 'INSERT OR UPDATE',
      updateColumns: `"companyId", "firstName", "lastName", "preferredName", "jobTitle", "primaryEmail", "primaryPhone", "linkedinProfile", "workAddressId"`,
    },
    { table: 'contact_functional_expertise', name: 'contact_fe_search_vector_trg', fn: 'trigger_refresh_contact_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'contact_sub_functional_expertise', name: 'contact_sfe_search_vector_trg', fn: 'trigger_refresh_contact_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'contact_industries', name: 'contact_industries_search_vector_trg', fn: 'trigger_refresh_contact_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'contact_sub_industries', name: 'contact_sub_industries_search_vector_trg', fn: 'trigger_refresh_contact_search_vector', events: 'INSERT OR UPDATE OR DELETE' },

    {
      table: 'companies',
      name: 'companies_search_vector_row_trg',
      fn: 'trigger_refresh_company_row_search_vector',
      events: 'INSERT OR UPDATE',
      updateColumns: `"companyName", website, "linkedinUrl", "parentCompanyId"`,
    },
    { table: 'company_industries', name: 'company_industries_search_vector_trg', fn: 'trigger_refresh_company_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'company_sub_industries', name: 'company_sub_industries_search_vector_trg', fn: 'trigger_refresh_company_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'company_brands', name: 'company_brands_search_vector_trg', fn: 'trigger_refresh_company_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'addresses', name: 'addresses_search_vector_trg', fn: 'trigger_refresh_company_search_vector', events: 'INSERT OR UPDATE OR DELETE' },

    {
      table: 'jobs',
      name: 'jobs_search_vector_row_trg',
      fn: 'trigger_refresh_job_row_search_vector',
      events: 'INSERT OR UPDATE',
      updateColumns: `"jobTitle", "jobCategory", "jobType", "permanentSubType", "headCount", "companyId", "contactId", country, state, "jobAddressId", "salaryType", "monthsPerYear", "annualSalary", "salaryFrom", "salaryTo", currency, "forecastBy", "percentOfAnnualSalary", "forecastFee"`,
    },
    { table: 'job_functional_expertise', name: 'job_fe_search_vector_trg', fn: 'trigger_refresh_job_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'job_sub_functional_expertise', name: 'job_sfe_search_vector_trg', fn: 'trigger_refresh_job_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'job_skills', name: 'job_skills_search_vector_trg', fn: 'trigger_refresh_job_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
    { table: 'job_keywords', name: 'job_keywords_search_vector_trg', fn: 'trigger_refresh_job_search_vector', events: 'INSERT OR UPDATE OR DELETE' },
  ]

  for (const { table, name, fn, events, updateColumns } of triggerSpecs) {
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS ${name} ON ${table}`)
    const eventClause = updateColumns
      ? `INSERT OR UPDATE OF ${updateColumns}`
      : events
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER ${name}
      AFTER ${eventClause} ON ${table}
      FOR EACH ROW
      EXECUTE FUNCTION ${fn}()
    `)
  }

  // When a company name changes, refresh contacts that display it in search results.
  await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS companies_contacts_search_vector_trg ON companies;`)
  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER companies_contacts_search_vector_trg
    AFTER UPDATE OF "companyName" ON companies
    FOR EACH ROW
    EXECUTE FUNCTION trigger_refresh_contacts_for_company();
  `)

  await execStatements(prisma, [
    `CREATE INDEX IF NOT EXISTS candidates_search_vector_idx ON candidates USING gin (search_vector)`,
    `CREATE INDEX IF NOT EXISTS contacts_search_vector_idx ON contacts USING gin (search_vector)`,
    `CREATE INDEX IF NOT EXISTS companies_search_vector_idx ON companies USING gin (search_vector)`,
    `CREATE INDEX IF NOT EXISTS jobs_search_vector_idx ON jobs USING gin (search_vector)`,
  ])

  console.log('Search vector setup complete.')
}

export async function backfillSearchVectors(prisma: PrismaClient) {
  console.log('Backfilling search vectors...')
  await prisma.$executeRawUnsafe(`SELECT refresh_all_search_vectors();`)
  console.log('Search vector backfill complete.')
}
