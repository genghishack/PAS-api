import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";
import {sqlForShortIncludedAddressesWithOrg} from "./address.js";
import {sqlForShortIncludedCategoriesWithOrg} from "./category.js";
import {pgQuery} from "../lib/postgres.js";

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
    tables: {organization: orgTable}
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
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e)
    return Promise.reject(e);
  }
}
