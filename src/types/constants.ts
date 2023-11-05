export type APIConsts = {
  port: number;
  url: string;
  protocol: string;
  full: string;
}

export type AWSConsts = {
  region: string;
  cognito: {
    userPoolId: string;
    identityPoolId: string;
    isp: AWS.CognitoIdentityServiceProvider;
    token: any;
  }
}

export type DBConsts = {
  host: string;
  port: number;
  user: string;
  pass: string;
  name: string;
}

export type Schemas = {
  user: string;
  resources: string;
  mgt: string;
  extensions: string;
}

export type Tables = {
  user: string;
  staging: string;
  category: string;
  professional: string;
  prof_x_cat: string;
  prof_deleted: string;
}

export type Constants = {
  api: APIConsts;
  aws: AWSConsts;
  db: DBConsts;
  schemas: Schemas;
  tables: Tables;
}

export interface IConstants {
  api: APIConsts;
  aws: AWSConsts;
  db: DBConsts;
  schemas: Schemas;
  tables: Tables;
}
