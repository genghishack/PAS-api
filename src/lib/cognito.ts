import {AccessTokenUserObj, CognitoGroupObj, CognitoUserObj, CognitoUserParams} from "../types/user";
import {IConstants} from "../types/constants";

export const getCognitoUserParams = (ATUserObj: AccessTokenUserObj): CognitoUserParams => {
  const rIss = ATUserObj.iss.split('/');
  const userPoolId: string = rIss[rIss.length - 1];
  const userSub: string = ATUserObj.sub;
  return<CognitoUserParams> {UserPoolId: userPoolId, Username: userSub}
}

export const getCognitoUserObj = async (userParams: CognitoUserParams): Promise<any> => {
  const {aws: {cognito}}: IConstants = constants;
  try {
    return cognito.isp.adminGetUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const getCognitoUserGroups = async (userParams: CognitoUserParams): Promise<any> => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    const {Groups} = await isp.adminListGroupsForUser(userParams).promise();
    return Groups;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const addCognitoUserToGroup = async (userParams: CognitoUserParams, group: any) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    return isp.adminAddUserToGroup({...userParams, GroupName: group}).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const removeCognitoUserFromGroup = async (userParams: CognitoUserParams, role: any) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    return isp.adminRemoveUserFromGroup({...userParams, GroupName: role}).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const listCognitoUsers = async (): Promise<any> => {
  const {aws: {cognito: {isp, userPoolId}}}: IConstants = constants;
  try {
    const {Users} = await isp.listUsers({UserPoolId: userPoolId}).promise();
    return Users;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const listCognitoGroups = async (): Promise<any> => {
  const {aws: {cognito: {isp, userPoolId}}}: IConstants = constants;
  try {
    const {Groups} = await isp.listGroups({UserPoolId: userPoolId}).promise();
    return Groups;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const createCognitoUser = async (userParams: CognitoUserParams) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    const newUser = await isp.adminCreateUser({
      ...userParams,
    }).promise();
    return newUser;
  } catch (e) {
    return Promise.reject(e);
  }
}

export const deleteCognitoUser = async (userParams: CognitoUserParams) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    return isp.adminDeleteUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const enableCognitoUser = async (userParams: CognitoUserParams) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    return isp.adminEnableUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const disableCognitoUser = async (userParams: CognitoUserParams) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    return isp.adminDisableUser(userParams).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}

export const updateUserAttribute = async (userParams: CognitoUserParams, attr: any) => {
  const {aws: {cognito: {isp}}}: IConstants = constants;
  try {
    return isp.adminUpdateUserAttributes({
      ...userParams,
      UserAttributes: [attr]
    }).promise();
  } catch (e) {
    return Promise.reject(e);
  }
}
