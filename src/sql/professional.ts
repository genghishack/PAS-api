import {pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

const adminFullProfessionalFields = `
      prof.id, name_last, name_first, name_prefix, name_suffix, name_json,
      phone_main, phone_fax, phone_cell, email, web_url, social_media_ids, contact_json,
      address_street_1, address_street_2, address_city, address_state, 
      address_postal_code, address_country, address_json,
      organization, specialties, speaking_topic, publications, bar_id,
      comments, internal_comments, internal_reminders
`;

const adminShortProfessionalFields = `
      prof.id, name_last, name_first, name_prefix, name_suffix,
      address_city, address_state, address_country, organization
`;

const sqlForIncludedCategories = (): string => {
  const {
    schemas: {resources: schema},
    tables: {professional: table, prof_deleted: delTable, category: catTable, prof_x_cat: joinTable}
  }: IConstants = constants;

  const categoriesSQL: string = `
      SELECT c.id, 
             c.name_display
      FROM ${schema}.${catTable} c
      INNER JOIN ${schema}.${joinTable} j ON (c.id = j.category_id)
      WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(categoriesSQL)} AS categories`;
}

export const listProfessionals = async (
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {professional: table, prof_deleted: delTable}
  }: IConstants = constants;
  let params: string[] = [];

  const label = `list all professionals`;
  log.info(label)

  const sql = `
    SELECT 
    ${adminShortProfessionalFields},
    ${sqlForIncludedCategories()}
    FROM ${schema}.${table} prof
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

export const getProfessionalById = async (
  id: string,
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {professional: table, category: catTable, prof_x_cat: joinTable}
  }: IConstants = constants;
  const params: string[] = [id];

  const label = `get professional ${id}`;

  const sql = `
    SELECT 
    ${adminFullProfessionalFields},
    ${sqlForIncludedCategories()}
    FROM ${schema}.${table} prof
    WHERE prof.id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}

export const listDeletedProfessionals = async (
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema}, tables: {professional: table, prof_deleted: delTable}
  }: IConstants = constants;
  const params: string[] = [];

  const label = `list deleted professionals`;

  const sql = `
    SELECT 
    ${adminFullProfessionalFields},
    ${sqlForIncludedCategories()},
      d.reason
    FROM ${schema}.${table} prof
    INNER JOIN ${schema}.${delTable} d ON (prof.id = d.professional_id)
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
