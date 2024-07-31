import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";
import {
  sqlForFullIncludedAddressesWithOrg,
  sqlForShortIncludedAddressesWithOrg
} from "./address.js";
import {sqlForShortIncludedCategoriesWithOrg} from "./category.js";
import {pgQuery} from "../lib/postgres.js";
import {
  sqlForIncludedEmailAddressesWithOrg,
  sqlForIncludedMediaHandlesWithOrg,
  sqlForIncludedPhoneNumbersWithOrg,
  sqlForIncludedUrlsWithOrg,
} from "./contact.js";
import {sqlForIncludedSpecialtiesWithOrg} from "./specialty.js";
import {sqlForShortIncludedPublicationsWithOrg} from "./publication.js";
import {sqlForIncludedCommentsWithOrg} from "./comment.js";
import {sqlForShortIncludedProfessionalsWithOrg} from "./professional.js";

export const adminFullOrganizationFields = `
  org.id, org.name_slug, org.name_display
`;

export const adminShortOrganizationFields = `
  org.id, org.name_display
`;

export const sqlForShortIncludedOrganizationsWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {organization: orgTable, prof_x_org: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT 
      ${adminShortOrganizationFields}
    FROM ${schema}.${orgTable} org
    INNER JOIN ${schema}.${joinTable} j ON (org.id = j.organization_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS organizations`;
}

export const listOrganizations = async (
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {organization: orgTable, org_deleted: delTable}
  }: IConstants = constants;
  let params: string[] = [];

  const label = `list all organizations`;
  log.info(label)

  const sql = `
    SELECT 
    ${adminShortOrganizationFields},
    ${sqlForShortIncludedAddressesWithOrg()},
    ${sqlForShortIncludedCategoriesWithOrg()}
    FROM ${schema}.${orgTable} org
    LEFT JOIN ${schema}.${delTable} d ON (org.id = d.organization_id)
    WHERE d.professional_id IS NULL;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e)
    return Promise.reject(e);
  }
}

export const listDeletedOrganizations = async (
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {organization: orgTable, org_deleted: delTable}
  }: IConstants = constants;
  let params: string[] = [];

  const label = `list deleted organizations`;
  log.info(label)

  const sql = `
    SELECT 
    ${adminShortOrganizationFields},
    ${sqlForShortIncludedAddressesWithOrg()},
    ${sqlForShortIncludedCategoriesWithOrg()},
      d.reason
    FROM ${schema}.${orgTable} org
    INNER JOIN ${schema}.${delTable} d ON (org.id = d.organization_id);
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e)
    return Promise.reject(e);
  }
}

export const getOrganizationById = async (
  id: string,
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {organization: orgTable}
  }: IConstants = constants;
  const params: string[] = [id];

  const label = `get organization ${id}`;

  const sql = `
    SELECT 
    ${adminFullOrganizationFields},
    ${sqlForIncludedPhoneNumbersWithOrg()},
    ${sqlForIncludedEmailAddressesWithOrg()},
    ${sqlForIncludedUrlsWithOrg()},
    ${sqlForIncludedMediaHandlesWithOrg()},
    ${sqlForIncludedSpecialtiesWithOrg()},
    ${sqlForFullIncludedAddressesWithOrg()},
    ${sqlForShortIncludedPublicationsWithOrg()},
    ${sqlForShortIncludedProfessionalsWithOrg()},
    ${sqlForShortIncludedCategoriesWithOrg()},
    ${sqlForIncludedCommentsWithOrg()}
    FROM ${schema}.${orgTable} org
    WHERE org.id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
