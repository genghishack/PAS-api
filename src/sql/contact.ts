import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

export const sqlForIncludedPhoneNumbersWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {prof_phone: phoneTable, phone_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      p.id, p.phone_number, t.type AS phone_type
    FROM ${schema}.${phoneTable} p
    INNER JOIN ${schema}.${typeTable} t ON (p.phone_type_id = t.id)
    WHERE p.professional_id = prof.id
  `
  return `${sqlForRowsAsJSON(sql)} AS phone_numbers`;
}

export const sqlForIncludedPhoneNumbersWithOrg = (): string => {
  const {
    schemas: {resources: schema},
    tables: {org_phone: phoneTable, phone_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      p.id, p.phone_number, t.type AS phone_type
    FROM ${schema}.${phoneTable} p
    INNER JOIN ${schema}.${typeTable} t ON (p.phone_type_id = t.id)
    WHERE p.organization_id = org.id
  `
  return `${sqlForRowsAsJSON(sql)} AS phone_numbers`;
}

export const sqlForIncludedEmailAddressesWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {prof_email: emailTable, email_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      e.id, e.email_address, t.type AS email_type
    FROM ${schema}.${emailTable} e
    INNER JOIN ${schema}.${typeTable} t ON (e.email_type_id = t.id)
    WHERE e.professional_id = prof.id
  `
  return `${sqlForRowsAsJSON(sql)} AS email_addresses`;
}

export const sqlForIncludedEmailAddressesWithOrg = (): string => {
  const {
    schemas: {resources: schema},
    tables: {org_email: emailTable, email_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      e.id, e.email_address, t.type AS email_type
    FROM ${schema}.${emailTable} e
    INNER JOIN ${schema}.${typeTable} t ON (e.email_type_id = t.id)
    WHERE e.organization_id = org.id
  `
  return `${sqlForRowsAsJSON(sql)} AS email_addresses`;
}

export const sqlForIncludedUrlsWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {prof_url: urlTable, url_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      u.id, u.url, t.type AS url_type
    FROM ${schema}.${urlTable} u
    INNER JOIN ${schema}.${typeTable} t ON (u.url_type_id = t.id)
    WHERE u.professional_id = prof.id
  `
  return `${sqlForRowsAsJSON(sql)} AS urls`;
}

export const sqlForIncludedUrlsWithOrg = (): string => {
  const {
    schemas: {resources: schema},
    tables: {org_url: urlTable, url_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      u.id, u.url, t.type AS url_type
    FROM ${schema}.${urlTable} u
    INNER JOIN ${schema}.${typeTable} t ON (u.url_type_id = t.id)
    WHERE u.organization_id = org.id
  `
  return `${sqlForRowsAsJSON(sql)} AS urls`;
}

export const sqlForIncludedMediaHandlesWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {prof_media: mediaTable, media_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      m.id, m.media_handle, t.type AS media_type
    FROM ${schema}.${mediaTable} m
    INNER JOIN ${schema}.${typeTable} t ON (m.media_type_id = t.id)
    WHERE m.professional_id = prof.id
  `
  return `${sqlForRowsAsJSON(sql)} AS media_handles`;
}

export const sqlForIncludedMediaHandlesWithOrg = (): string => {
  const {
    schemas: {resources: schema},
    tables: {org_media: mediaTable, media_type: typeTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      m.id, m.media_handle, t.type AS media_type
    FROM ${schema}.${mediaTable} m
    INNER JOIN ${schema}.${typeTable} t ON (m.media_type_id = t.id)
    WHERE m.organization_id = org.id
  `
  return `${sqlForRowsAsJSON(sql)} AS media_handles`;
}

export const sqlForIncludedBarIdsWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {prof_bar: barTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      b.id, b.bar_id, b.state_abbr
    FROM ${schema}.${barTable} b
    WHERE b.professional_id = prof.id
  `
  return `${sqlForRowsAsJSON(sql)} AS bar_ids`;
}
