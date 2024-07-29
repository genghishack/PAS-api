import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

export const sqlForIncludedCommentsWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {comment: mainTable, prof_x_comment: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      c.id, c.comment, c.public, 
      c.created_by, c.created_at, c.updated_by, c.updated_at
    FROM ${schema}.${mainTable} c
    INNER JOIN ${schema}.${joinTable} j ON (c.id = j.comment_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS comments`;
}
