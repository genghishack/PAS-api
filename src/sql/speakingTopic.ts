import {IConstants} from "../types/constants";
import {sqlForRowsAsJSON} from "./json.js";

export const sqlForIncludedSpeakingTopicsWithProf = (): string => {
  const {
    schemas: {resources: schema},
    tables: {topic: topicTable, prof_x_topic: joinTable}
  }: IConstants = constants;

  const sql: string = `
    SELECT
      topic.id, topic.name, topic.description
    FROM ${schema}.${topicTable} topic
    INNER JOIN ${schema}.${joinTable} j ON (topic.id = j.speaking_topic_id)
    WHERE j.professional_id = prof.id
  `;
  return `${sqlForRowsAsJSON(sql)} AS speaking_topics`;
}
