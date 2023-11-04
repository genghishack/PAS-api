import {pgQuery} from "../lib/postgres.js";

export const listCategories = async (
  debug: boolean = false,
) => {
  const label = `list categories`;
  log.info(label);
  let params: string[] = [];

  const sql = `
    SELECT *
    FROM pas_resources.category;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e);
    return Promise.reject(e);
  }
}
