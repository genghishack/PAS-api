import {pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";

export const listCategories = async (
  debug: boolean = false,
) => {
  const {schemas: {resources: schema}, tables: {category: tableName}}: IConstants = constants;
  let params: string[] = [];

  const label = `list all categories`;
  log.info(label);

  const sql: string = `
    SELECT *
    FROM ${schema}.${tableName};
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
  const {schemas: {resources: schema}, tables: {category: tableName}}: IConstants = constants;
  let params: string[] = [id];

  const label = `get category ${id}`;
  log.info(label);

  const sql = `
    SELECT *
    FROM ${schema}.${tableName}
    WHERE id = $1;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}
