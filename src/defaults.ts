import {Schemas, Tables} from "./types/constants";
import {
  AccessTokenUserObj,
  CognitoGroupObj,
  CognitoUserAttribute,
  CognitoUserObj,
  CognitoUserParams,
  DBUserObj,
  UserObj
} from "./types/user";

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
  prof_geom: 'professional_geom',
}

export const defaultAccessTokenUserObj: AccessTokenUserObj = {
  sub: '',
  "cognito:groups": [],
  iss: '',
  client_id: '',
  event_id: '',
  token_use: '',
  scope: '',
  auth_time: 0,
  exp: 0,
  iat: 0,
  jti: '',
  username: ''
}

export const defaultCognitoUserParams: CognitoUserParams = {
  Username: '',
  UserPoolId: '',
}

export const defaultCognitoUserAttribute: CognitoUserAttribute = {
  Name: '',
  Value: '',
}

export const defaultCognitoUserObj: CognitoUserObj = {
  Username: '',
  UserAttributes: [defaultCognitoUserAttribute],
  UserCreateDate: '',
  UserLastModifiedDate: '',
  Enabled: false,
  UserStatus: ''
}

export const defaultCognitoGroupObj: CognitoGroupObj = {
  GroupName: '',
  UserPoolId: '',
  RoleArn: '',
  LastModifiedDate: '',
  CreationDate: '',
}

export const defaultDBUserObj: DBUserObj = {
  id: '',
  federated_id: '',
  email: '',
  name: '',
  roles: [],
  created_at: '',
  created_by: '',
  updated_at: '',
  updated_by: '',
}

export const defaultUser: UserObj = {
  auth: false,
  accessToken: defaultAccessTokenUserObj,
  dbUser: defaultDBUserObj,
  userParams: defaultCognitoUserParams,
  cognitoUser: defaultCognitoUserObj,
  cognitoGroups: [defaultCognitoGroupObj],
}
