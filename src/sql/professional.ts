import {pgQuery} from "../lib/postgres.js";

export const listProfessionals = async (
  debug: boolean = false,
) => {
  const label = `list resources`;
  log.info(label)
  let params: string[] = [];

  const sql = `
    SELECT *
    FROM pas_resources.professional;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    log.error(e)
    return Promise.reject(e);
  }
}
