import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

export const sqlForIncludedSpecialtiesWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {specialty: specTable, prof_x_spec: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      spec.id, spec.name, spec.description
    FROM ${schema}.${specTable} spec
    INNER JOIN ${schema}.${joinTable} j ON (spec.id = j.specialty_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS specialties`;
}
