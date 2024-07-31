import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

export const adminFullPublicationFields = `
  pub.id, pub.title, pub.year, pub.month pub.publisher pub.description
`;

export const adminShortPublicationFields = `
  pub.id, pub.title, pub.publisher
`;

export const sqlForShortIncludedPublicationsWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {pub: pubTable, prof_x_pub: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT 
      ${adminShortPublicationFields}
    FROM ${schema}.${pubTable} pub
    INNER JOIN ${schema}.${joinTable} j ON (pub.id = j.publication_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS publications`;
}

export const sqlForShortIncludedPublicationsWithOrg = (): string => {
  const {
    schemas: {resources: schema},
    tables: {pub: pubTable, org_x_pub: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT 
      ${adminShortPublicationFields}
    FROM ${schema}.${pubTable} pub
    INNER JOIN ${schema}.${joinTable} j ON (pub.id = j.publication_id)
    WHERE j.organization_id = org.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS publications`;
}
