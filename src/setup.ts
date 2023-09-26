import Logger from "bunyan";
import dotenv from "dotenv";
import bunyan from "bunyan";
import {Constants} from "./types/constants";
import {getDateStamp} from "./lib/utils.js";

declare global {
  var log: Logger;
  var constants: Constants
}

export const init = (): void => {
  dotenv.config({path: '.env'});
  globalThis.log = logger(`${getDateStamp()}`, false);
  globalThis.constants = {
    api: {
      port: parseInt(process.env.API_PORT!, 10),
      url: process.env.API_URL!
    }
  }
}

const logger = (logName: string, src: boolean = false) => {
  return bunyan.createLogger({
    name: logName,
    src,
    serializers: bunyan.stdSerializers,
    streams: [
      {
        level: "info",
        stream: process.stdout,
      },
      {
        level: "debug",
        type: "file",
        path: `${process.env.LOG_PATH}/${logName}.log`,
        period: "1d",
        count: 5,
      }
    ]
  })
}

export default {};
