import {pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";
import {sqlForIncludedProfessionalsWithCat} from "./professional.js";

export const adminFullCategoryFields = `
      cat.id, name_slug, name_display
`;

export const adminShortCategoryFields = `
      cat.id, name_display
`;

export const sqlForShortIncludedCategoriesWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {category: catTable, prof_x_cat: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT 
      ${adminShortCategoryFields}
    FROM ${schema}.${catTable} cat
    INNER JOIN ${schema}.${joinTable} j ON (cat.id = j.category_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS categories`;
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
    ${adminFullCategoryFields}
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

export const getCategoryByIdWithProfessionals = async (
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
    ${sqlForIncludedProfessionalsWithCat()}
    FROM ${schema}.${catTable} cat
    WHERE cat.id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
