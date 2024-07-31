import {pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";
import {sqlForShortIncludedCategoriesWithProf} from "./category.js";
import {sqlForFullIncludedAddressesWithProf, sqlForShortIncludedAddressesWithProf} from "./address.js";
import {sqlForShortIncludedOrganizationsWithProf} from "./organization.js";
import {sqlForIncludedSpecialtiesWithProf} from "./specialty.js";
import {sqlForIncludedSpeakingTopicsWithProf} from "./speakingTopic.js";
import {
  sqlForIncludedBarIdsWithProf,
  sqlForIncludedEmailAddressesWithProf,
  sqlForIncludedMediaHandlesWithProf,
  sqlForIncludedPhoneNumbersWithProf,
  sqlForIncludedUrlsWithProf
} from "./contact.js";
import {sqlForShortIncludedPublicationsWithProf} from "./publication.js";
import {sqlForIncludedCommentsWithProf} from "./comment.js";

export const adminFullProfessionalFields = `
  prof.id, prof.name_last, prof.name_first, prof.name_prefix, prof.name_suffix 
`;

export const adminShortProfessionalFields = `
  prof.id, prof.name_last, prof.name_first
`;

export const sqlForShortIncludedProfessionalsWithOrg = (): string => {
  const {
    schemas: {resources: schema},
    tables: {professional: profTable, prof_x_org: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT 
      ${adminShortProfessionalFields}
    FROM ${schema}.${profTable} prof
    INNER JOIN ${schema}.${joinTable} j ON (prof.id = j.professional_id)
    WHERE j.organization_id = org.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS professionals`;
}

export const sqlForIncludedProfessionalsWithCat = (): string => {
  const {
    schemas: {resources: schema},
    tables: {professional: profTable, prof_deleted: delTable, address_geom: geomTable, prof_x_cat: joinTable}
  }: IConstants = constants;

  const sql: string = `
      SELECT 
        ${adminShortProfessionalFields},
        ${sqlForShortIncludedAddressesWithProf()}
        --ST_AsGeoJSON(g.shape) AS geojson
      FROM ${schema}.${profTable} prof
      INNER JOIN ${schema}.${joinTable} j ON (prof.id = j.professional_id)
      LEFT JOIN ${schema}.${delTable} d ON (prof.id = d.professional_id)
--      LEFT JOIN ${schema}.${geomTable} g ON (prof.id = g.professional_id)
      WHERE j.category_id = cat.id
      AND d.professional_id IS NULL
  `;
  return `${sqlForRowsAsJSON(sql)} AS professionals`;
}

export const listProfessionals = async (
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {professional: profTable, prof_deleted: delTable}
  }: IConstants = constants;
  let params: string[] = [];

  const label = `list all professionals`;
  log.info(label)

  const sql = `
    SELECT 
    ${adminShortProfessionalFields},
    ${sqlForShortIncludedAddressesWithProf()},
    ${sqlForShortIncludedCategoriesWithProf()}
    FROM ${schema}.${profTable} prof
    LEFT JOIN ${schema}.${delTable} d ON (prof.id = d.professional_id)
    WHERE d.professional_id IS NULL;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e)
    return Promise.reject(e);
  }
}

export const listDeletedProfessionals = async (
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {professional: table, prof_deleted: delTable}
  }: IConstants = constants;
  const params: string[] = [];

  const label = `list deleted professionals`;
  log.info(label)

  const sql = `
    SELECT 
    ${adminShortProfessionalFields},
    ${sqlForShortIncludedAddressesWithProf()},
    ${sqlForShortIncludedCategoriesWithProf()},
      d.reason
    FROM ${schema}.${table} prof
    INNER JOIN ${schema}.${delTable} d ON (prof.id = d.professional_id);
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getProfessionalById = async (
  id: string,
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {professional: profTable}
  }: IConstants = constants;
  const params: string[] = [id];

  const label = `get professional ${id}`;

  const sql = `
    SELECT 
    ${adminFullProfessionalFields},
    ${sqlForIncludedPhoneNumbersWithProf()},
    ${sqlForIncludedEmailAddressesWithProf()},
    ${sqlForIncludedUrlsWithProf()},
    ${sqlForIncludedMediaHandlesWithProf()},
    ${sqlForIncludedBarIdsWithProf()},
    ${sqlForIncludedSpecialtiesWithProf()},
    ${sqlForIncludedSpeakingTopicsWithProf()},
    ${sqlForFullIncludedAddressesWithProf()},
    ${sqlForShortIncludedOrganizationsWithProf()},
    ${sqlForShortIncludedPublicationsWithProf()},
    ${sqlForShortIncludedCategoriesWithProf()},
    ${sqlForIncludedCommentsWithProf()}
    FROM ${schema}.${profTable} prof
    WHERE prof.id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
