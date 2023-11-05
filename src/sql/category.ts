import {pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";

export const listCategories = async (
  debug: boolean = false,
) => {
  const {schemas: {resources: schema}, tables: {category: table}}: IConstants = constants;
  let params: string[] = [];

  const label = `list all categories`;
  log.info(label);

  const sql: string = `
    SELECT *
    FROM ${schema}.${table};
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e);
    return Promise.reject(e);
  }
}

export const getCategoryById = async (
  id: string,
  debug: boolean = false,
) => {
  const {schemas: {resources: schema}, tables: {category: table}}: IConstants = constants;
  let params: string[] = [id];

  const label = `get category ${id}`;
  log.info(label);

  const sql = `
    SELECT *
    FROM ${schema}.${table}
    WHERE id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getProfessionalsByCategoryId = async (
  id: string,
  debug: boolean = false,
) => {
  const {
    schemas: {resources: schema},
    tables: {professional: table, prof_x_cat: joinTable, prof_deleted: deletedTable}
  }: IConstants = constants;
  let params: string[] = [id];

  const label = `get professionals for category ${id}`;
  log.info(label);

  const sql = `
    SELECT *
    FROM ${schema}.${table} t
    INNER JOIN ${schema}.${joinTable} j ON (t.id = j.professional_id)
    LEFT JOIN ${schema}.${deletedTable} d ON (t.id = d.professional_id)
    WHERE j.category_id = $1
    AND d.professional_id IS NULL;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
