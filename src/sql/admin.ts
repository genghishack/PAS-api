import {IConstants} from "../types/constants";
import {pgQuery} from "../lib/postgres.js";

export const adminDeleteUser = async(id: string) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const label = `delete user ${id}`;
  log.info(label);

  const params = [id];
  const sql = `
    DELETE FROM ${schema}.${tableName}
    WHERE id = $1
    RETURNING *;
  `;
  return pgQuery(sql, params, label, false);
}
