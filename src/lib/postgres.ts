import pg from 'pg';
import {IConstants} from "../types/constants";

const getPgConnectionStr = (): string => {
  const {db: {host, port, user, pass, name}}: IConstants = constants;
  const encodedPasswd: string = encodeURIComponent(pass);
  return `postgres://${user}:${encodedPasswd}@${host}:${port}/${name}`;
}

const getPgClient = (): pg.Client => {
  const pgConnectionString: string = getPgConnectionStr();
  return new pg.Client(pgConnectionString);
}

const pgConnect = async (client: pg.Client): Promise<void> => {
  try {
    await client.connect();
  } catch (e) {
    log.error(e);
  }
}

const pgEnd = async (client: pg.Client): Promise<void> => {
  try {
    await client.end();
  } catch (e) {
    log.error(e);
  }
}

export const pgQuery = async (
  sql: string,
  parameters: string[] = [],
  sqlLabel: string = '',
  debug: boolean = false
): Promise<any> => {
  if (!sql) return Promise.reject(new Error('No SQL provided for query'));

  const label: string = (sqlLabel) ? `SQL Query: ${sqlLabel}` : 'SQL query';
  (debug) ? log.debug({label, parameters, sql}) : log.debug(label);

  const pgClient: pg.Client = getPgClient();
  try {
    await pgConnect(pgClient);
    const result: pg.QueryResult = await pgClient.query(sql, parameters);
    return result.rows;
  } catch (e) {
    log.debug(`Error in SQL Query '${sqlLabel}'`, parameters, sql);
    log.error(e);
    return [e];
  } finally {
    await pgEnd(pgClient);
  }
}

export const pgCleanString = (str: string) => {
  return str.replace(/'/g, "''");
}
