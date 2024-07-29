import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

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
