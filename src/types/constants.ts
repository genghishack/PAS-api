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
  organization: string;
  address: string;
  specialty: string;
  topic: string;
  pub: string;
  comment: string;
  prof_x_org: string;
  prof_x_cat: string;
  prof_x_addr: string;
  prof_x_spec: string;
  prof_x_topic: string;
  prof_x_pub: string;
  prof_x_comment: string;
  prof_deleted: string;
  prof_phone: string;
  prof_email: string;
  prof_social: string;
  prof_url: string;
  prof_bar: string;
  org_x_cat: string;
  org_x_addr: string;
  org_x_spec: string;
  org_x_pub: string;
  org_x_comment: string;
  org_deleted: string;
  org_phone: string;
  org_email: string;
  org_social: string;
  org_url: string;
  address_geom: string;
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
