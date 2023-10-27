import {pgCleanString, pgQuery} from "../lib/postgres.js";
import {IConstants} from "../types/constants";
import {IUserObj, UserObj} from "../types/user";

export const getUser = async (
  id: string,
  debug: boolean = false
) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const label = `get user ${id}`;
  log.info(label);
  let params: string[] = [id]

  const sql = `
    SELECT * from ${schema}.${tableName}
    WHERE id = $1;
  `;

  try {
    const [user] = await pgQuery(sql, params, label, debug);
    return user;
  } catch (e) {
    log.error(e);
    return Promise.reject(e);
  }
};

// const createUser = async (
//   user: any,
//   data: any
// ) => {
//   const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
//   const label = 'create user';
//   let params: string[] = []
//
//   const sql = `
//     SELECT 'no-op';
//   `;
//
//   try {
//     return pgQuery(sql, params, label);
//   } catch (e) {
//     return Promise.reject(e);
//   }
// };

const createUserOnSignup = async (user: any) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const label = 'create user on signup';
  let params = [
    user.userParams.Username,
    // user.userIdentity.federatedId,
    user.email,
    user.name,
    JSON.stringify(user.roles),
  ];

  const sql = `
    INSERT INTO ${schema}.${tableName}
    (
      id, 
      federated_id, 
      email,
      name,
      roles,
      created_at, 
      created_by, 
      updated_at, 
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, NOW(), $1, NOW(), $1)
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
}

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
export const userCreateSelfDBRecord = async (user: UserObj, data: any) => {
  const {schemas: {user: schema}, tables: {user: tableName}}: IConstants = constants;
  const {userParams: {Username}}: IUserObj = user;

  const label = `create user db record ${Username} upon signup`;
  log.info(label);

  const params = [Username, data.email, data.name, JSON.stringify(data.roles)];
  const sql = `
    INSERT INTO ${schema}.${tableName} (
      id, email, name, roles, created_at, created_by, updated_at, updated_by
    )
    VALUES ($1, $2, $3, $4, NOW(), $1, NOW(), $1)
    RETURNING *;
  `;
  return pgQuery(sql, params, label, false);
}
