import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

export const adminShortAddressFields = `
  addr.id, addr.city, addr.state, addr.country
`;

export const adminFullAddressFields = `
  addr.id, addr.street_1, addr.street_2, 
  addr.city, addr.state, addr.postal_code, addr.country
`;

export const sqlForShortIncludedAddressesWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {address: addrTable, prof_x_addr: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      ${adminShortAddressFields}
    FROM ${schema}.${addrTable} addr
    INNER JOIN ${schema}.${joinTable} j ON (addr.id = j.address_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS addresses`;
}

export const sqlForFullIncludedAddressesWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {address: addrTable, prof_x_addr: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      ${adminFullAddressFields}
    FROM ${schema}.${addrTable} addr
    INNER JOIN ${schema}.${joinTable} j ON (addr.id = j.address_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS addresses`;
}
