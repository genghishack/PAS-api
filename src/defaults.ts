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
  resources: 'resources',
  mgt: 'mgt',
  extensions: 'public',
}

export const defaultTables: Tables = {
  user: 'app_user',
  staging: 'csv_staging',
  category: 'category',
  professional: 'professional',
  organization: 'organization',
  address: 'address',
  specialty: 'specialty',
  topic: 'speaking_topic',
  pub: 'publication',
  comment: 'comment',
  address_geom: 'professional_geom',
  phone_type: 'phone_type',
  email_type: 'email_type',
  url_type: 'url_type',
  media_type: 'social_media_type',
  prof_x_cat: 'professional_category',
  prof_x_org: 'professional_organization',
  prof_x_addr: 'professional_address',
  prof_x_spec: 'professional_specialty',
  prof_x_topic: 'professional_speaking_topic',
  prof_x_pub: 'professional_publication',
  prof_x_comment: 'professional_comment',
  prof_deleted: 'professional_deleted',
  prof_phone: 'professional_phone',
  prof_email: 'professional_email',
  prof_media: 'professional_social_media',
  prof_url: 'professional_url',
  prof_bar: 'professional_bar_id',
  org_x_cat: 'organization_category',
  org_x_addr: 'organization_address',
  org_x_spec: 'organization_specialty',
  org_x_pub: 'organization_publication',
  org_x_comment: 'organization_comment',
  org_deleted: 'organization_deleted',
  org_phone: 'organization_phone',
  org_email: 'organization_email',
  org_social: 'organization_social_media',
  org_url: 'organization_url',
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
