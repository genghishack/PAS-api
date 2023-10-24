import AWS from "aws-sdk";
import Logger from "bunyan";
import dotenv from "dotenv";
import bunyan from "bunyan";
import {Constants, Schemas, Tables} from "./types/constants";
import {getDateStamp} from "./lib/utils.js";
import CognitoExpress from "cognito-express";

declare global {
  var log: Logger;
  var constants: Constants
}

export const defaultSchemas: Schemas = {
  user: 'public',
  resources: 'pas_resources',
  mgt: 'mgt',
  extensions: 'public',
}

export const defaultTables: Tables = {
  user: 'app_user',
  staging: 'csv_staging',
  category: 'category',
  professional: 'professional',
  prof_x_cat: 'professional_category',
  prof_deleted: 'professional_deleted',
}

export const init = (): void => {
  dotenv.config({path: '.env'});
  globalThis.log = logger(`${getDateStamp()}`, false);
  globalThis.constants = {
    api: {
      port: parseInt(process.env.API_PORT!, 10),
      url: process.env.API_URL!
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
