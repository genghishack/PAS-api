import {AccessTokenUserObj, CognitoUserObj, UserObj, CognitoUserParams} from "../types/user";
import {getCognitoUserObj, getCognitoUserGroups, getCognitoUserParams, addCognitoUserToGroup} from "./cognito.js";
import {getUser} from "../sql/user.js";

export const isAdmin = (user: UserObj) => {
  return user.auth && user.accessToken['cognito:groups'].includes('Admin');
}

export const isEditor = (user: UserObj) => {
  return user.auth && user.accessToken['cognito:groups'].includes('Editor');
}

export const isUser = (user: UserObj) => {
  return user.auth && user.accessToken['cognito:groups'].includes('User');
}

export const isGuest = (user: UserObj) => {
  return user.auth === false;
}

export const getUserObj = async (ATUserObj: AccessTokenUserObj): Promise<UserObj> => {
  const userParams: CognitoUserParams = getCognitoUserParams(ATUserObj);
  try {
    const cognitoUserObj: CognitoUserObj = await getCognitoUserObj(userParams)
    const cognitoUserGroups = await getCognitoUserGroups(userParams);
    const dbUserObj = await getUser(userParams.Username);
    return<UserObj> {
      auth: true,
      accessToken: ATUserObj,
      dbUser: dbUserObj,
      cognitoUser: cognitoUserObj,
      cognitoGroups: cognitoUserGroups,
      userParams,
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getUserRoles = async (userParams: CognitoUserParams) => {
  try {
    let userGroups = await getCognitoUserGroups(userParams);
    if (!userGroups.length) {
      await addCognitoUserToGroup(userParams, 'User');
      userGroups = await getCognitoUserGroups(userParams);
    }
    let userRoles: any[] = [];
    userGroups.forEach((group: any) => {
      userRoles.push(group.GroupName);
    });
    return userRoles;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getUserAttribute = (cognitoUser: any, attrName: string) => {
  const {UserAttributes, Attributes} = cognitoUser;
  let attribute;
  if (UserAttributes) {
    //@ts-ignore
    attribute = UserAttributes.filter(attr => attr.Name === attrName);
  } else {
    //@ts-ignore
    attribute = Attributes.filter(attr => attr.Name === attrName);
  }
  return attribute.length ? attribute[0].Value : null
}

export const getUserModel = (userRecord: any) => {
  const {id, name, email, roles} = userRecord;
  return {id, name, email, roles};
}
