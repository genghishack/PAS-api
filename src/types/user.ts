export type AccessTokenUserObj = {
  "sub": string,
  "cognito:groups": string[],
  "iss": string,
  "client_id": string,
  "event_id": string,
  "token_use": string,
  "scope": string,
  "auth_time": number,
  "exp": number,
  "iat": number,
  "jti": string,
  "username": string
}

export type CognitoUserParams = {
  "Username": string;
  "UserPoolId": string;
}

export type CognitoUserAttribute = {
  "Name": string;
  "Value": string;
}

export type CognitoUserObj = {
  "Username": string;
  "UserAttributes": CognitoUserAttribute[];
  "UserCreateDate": string;
  "UserLastModifiedDate": string;
  "Enabled": boolean;
  "UserStatus": string;
}

export type CognitoGroupObj = {
  "GroupName": string,
  "UserPoolId": string,
  "RoleArn": string,
  "LastModifiedDate": string,
  "CreationDate": string
}

export type DBUserObj = {
  id: string,
  federated_id: string,
  email: string,
  name: string,
  roles: string[],
  created_at: string,
  created_by: string,
  updated_at: string,
  updated_by: string
}

export type UserObj = {
  auth: boolean;
  accessToken: AccessTokenUserObj;
  dbUser: DBUserObj;
  cognitoUser: CognitoUserObj;
  cognitoGroups: CognitoGroupObj[];
  userParams: CognitoUserParams;
}

export interface IUserObj {
  userParams: CognitoUserParams;
}
