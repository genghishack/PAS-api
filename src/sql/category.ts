import {pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";
import {adminShortProfessionalFields} from "./professional.js";

export const adminFullCategoryFields = `
      cat.id, name_slug, name_display
`;

export const adminShortCategoryFields = `
      cat.id, name_display
`;

const sqlForIncludedProfessionals = (): string => {
  const {
    schemas: {resources: schema},
    tables: {professional: profTable, prof_deleted: delTable, prof_x_cat: joinTable}
  }: IConstants = constants;

  const professionalsSQL: string = `
      SELECT 
      ${adminShortProfessionalFields}
      FROM ${schema}.${profTable} prof
      INNER JOIN ${schema}.${joinTable} j ON (prof.id = j.professional_id)
      LEFT JOIN ${schema}.${delTable} d ON (prof.id = d.professional_id)
      WHERE j.category_id = cat.id
      AND d.professional_id IS NULL
  `;
  return `${sqlForRowsAsJSON(professionalsSQL)} AS professionals`;
}


export const listCategories = async (
  debug: boolean = false,
) => {
  const {schemas: {resources: schema}, tables: {category: catTable}}: IConstants = constants;
  let params: string[] = [];

  const label = `list all categories`;
  log.info(label);

  const sql: string = `
    SELECT
    ${adminShortCategoryFields}
    FROM ${schema}.${catTable} cat;
  `;

  try {
    const result = await pgQuery(sql, params, label, debug);
    // log.debug({result});
    return result;
  } catch (e) {
    log.error(e);
    return Promise.reject(e);
  }
}

export const getCategoryById = async (
  id: string,
  debug: boolean = false,
) => {
  const {schemas: {resources: schema}, tables: {category: catTable}}: IConstants = constants;
  let params: string[] = [id];

  const label = `get category ${id}`;
  log.info(label);

  const sql = `
    SELECT
    ${adminFullCategoryFields}
    FROM ${schema}.${catTable} cat
    WHERE id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}

export const CategoryByIdWithProfessionals = async (
  id: string,
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {category: catTable}
  }: IConstants = constants;
  let params: string[] = [id];

  const label = `get category ${id} with professionals`;
  log.info(label);

  const sql = `
    SELECT 
    ${adminShortCategoryFields},
    ${sqlForIncludedProfessionals()}
    FROM ${schema}.${catTable} cat
    WHERE cat.id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
