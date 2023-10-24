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

export type UserObj = {
  auth: boolean;
  accessToken: AccessTokenUserObj;
  userParams: CognitoUserParams;
  cognitoUser: CognitoUserObj;
  cognitoGroups: CognitoGroupObj[];
}
