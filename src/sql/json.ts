export const sqlForRowsAsJSON = (sql: string): string => {
  return `
    (SELECT array_to_json(array_agg(row_to_json(r)))
     FROM (${sql}) r)
  `;
}

export const sqlForRowAsJSON = (sql: string): string => {
  return `
    (SELECT row_to_json(r)
     FROM (${sql}) r)
  `;
}
