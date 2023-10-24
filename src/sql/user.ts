import {pgCleanString, pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";
import {UserObj} from "../types/user";

export const getUser = async (
  id: string,
  debug: boolean = false
) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const label = `get user by id ${id}`;
  let params: string[] = [id]

  const sql = `
    SELECT * from ${schema}.${tableName}
    WHERE id = $1;
  `;

  try {
    const result = await pgQuery(sql, params, label, debug);
    log.debug(result);
    return result;
  } catch (e) {
    log.error(e);
    return Promise.reject(e);
  }
};

const createUser = async (
  user: any,
  data: any
) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const label = 'create user';
  let params: string[] = []

  const sql = `
    SELECT 'no-op';
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const updateUser = async (
  adminUser: UserObj,
  user: any,
  debug: boolean = false,
) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const label = 'update user';

  const params = [
    user.id,
    pgCleanString(user.email),
    pgCleanString(user.name),
    JSON.stringify(user.roles),
    adminUser.userParams.Username,
  ]
  const sql = `
    UPDATE ${schema}.${tableName}
    SET
      email = $2,
      name = $3,
      roles = $4,
      updated_at = NOW(),
      updated_by = $5
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label, debug);
  } catch (e) {
    return Promise.reject(e);
  }
}