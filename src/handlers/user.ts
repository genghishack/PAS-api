import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {CognitoUserParams} from "../types/user";
import {getUserModel, isAdmin, isGuest} from "../lib/user.js";
import {failure, noAccess, success} from "../lib/response.js";
import {deleteCognitoUser, listCognitoUsers} from "../lib/cognito.js";
import {adminCreateUser, adminGetUserModel} from "../lib/admin.js";
import {userCreateSelfDBRecord} from "../sql/user.js";
import {adminDeleteUser} from "../sql/admin.js";

export const adminListUsers = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {aws: {cognito: {userPoolId}}}: IConstants = constants;
  try {
    const cognitoUsers = await listCognitoUsers();
    const userList = await Promise.all(cognitoUsers.map((itemCognitoUser: any) => {
      const itemUserParams: CognitoUserParams = {
        Username: itemCognitoUser.Username,
        UserPoolId: userPoolId
      }
      return adminGetUserModel(user, itemUserParams);
    }));
    return success(res, {data: userList, count: userList.length});
  } catch (e) {
    return failure(res, e)
  }
}

export const adminGetUserById = async (req: Request, res: Response, next: NextFunction) => {
  const {user: requestingUser} = res.locals;
  if (!isAdmin(requestingUser)) return noAccess(res);

  const {aws: {cognito: {userPoolId}}}: IConstants = constants;
  const requestedUserParams: CognitoUserParams = {
    Username: req.params.id,
    UserPoolId: userPoolId
  }
  const userObj = await adminGetUserModel(requestingUser, requestedUserParams)
  return success(res, {data: userObj, count: 1});
}

export const adminDeleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  const {user: requestingUser} = res.locals;
  if (!isAdmin(requestingUser)) return noAccess(res);

  const {aws: {cognito: {userPoolId}}}: IConstants = constants;
  const requestedUserParams: CognitoUserParams = {
    Username: req.params.id,
    UserPoolId: userPoolId
  }
  try {
    const deletedUser = await adminDeleteUser(req.params.id);
    await deleteCognitoUser(requestedUserParams);
    return success(res, {data: deletedUser, count: 1});
  } catch (e) {
    return failure(res, e);
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (isGuest(user)) return noAccess(res);

  // TODO: get data from request
  const data = {
    email: 'user@example.com',
    name: 'Example User',
    roles: ['User']
  };
  let newUser = {};
  try {
    if (isAdmin(user) && data.email) {
      newUser = adminCreateUser(data);
    } else {
      // Non-admin users can only create their own db record upon signup
      const [newUserRecord] = await userCreateSelfDBRecord(user, data);
      newUser = getUserModel(newUserRecord);
    }
    return success(res, {data: newUser, count: 1});
  } catch (e) {
    return failure(res, e);
  }
}

export const adminEditUserById = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const message = 'edited user';
  log.debug(message);
  return success(res, {data: message});
}

export const adminReplaceUserById = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const message = 'replaced user';
  log.debug(message);
  return success(res,{data: message});
}

