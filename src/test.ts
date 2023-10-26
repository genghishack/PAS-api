import {init} from "./setup.js";
import {pgQuery} from "./lib/postgres.js";

init();
// log.debug(constants);

const main = async () => {
  const sql = `SELECT postgis_full_version();`;
  const result = await pgQuery(sql);
  log.info(result);
}

await main();
