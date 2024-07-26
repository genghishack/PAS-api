import AWS from "aws-sdk";
import Logger from "bunyan";
import bunyan from "bunyan";
import dotenv from "dotenv";
import {Constants} from "./types/constants";
import {getDateStamp} from "./lib/utils.js";
import CognitoExpress from "cognito-express";
import {defaultSchemas, defaultTables} from "./defaults";

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
      url: process.env.API_URL!,
      protocol: process.env.API_PROTOCOL!,
      full: `${process.env.API_PROTOCOL}://${process.env.API_URL!}:${parseInt(process.env.API_PORT!, 10)}`
    },
    aws: {
      region: process.env.AWS_REGION!,
      cognito: {
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID!,
        isp: new AWS.CognitoIdentityServiceProvider({
          apiVersion: '2016-04-18',
          region: process.env.AWS_REGION!
        }),
        token: new CognitoExpress({
          region: process.env.AWS_REGION!,
          cognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
          tokenUse: "access",
          tokenExpiration: 3600000
        })
      }
    },
    db: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!, 10),
      user: process.env.DB_USER!,
      pass: process.env.DB_PASS!,
      name: process.env.DB_NAME!
    },
    schemas: defaultSchemas,
    tables: defaultTables
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
