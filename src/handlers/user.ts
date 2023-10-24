import {NextFunction, Request, Response} from "express";
import {isAdmin} from "../lib/user";
import {failure, noAccess, success} from "../lib/response";
import {IConstants} from "../types/constants";
import {listCognitoUsers} from "../lib/cognito";
import {CognitoUserParams} from "../types/user";
import {getAdminUserModel} from "../lib/admin";

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const {aws: {cognito: {userPoolId}}}: IConstants = constants;
  try {
    const cognitoUsers = await listCognitoUsers();
    const users = await Promise.all(cognitoUsers.map((cognitoUser: any) => {
      const userParams: CognitoUserParams = {
        Username: cognitoUser.Username,
        UserPoolId: userPoolId
      }
      return getAdminUserModel(user, userParams);
    }));
    return success(res, {data: users, count: users.length});
  } catch (e) {
    return failure(res, e)
  }
  return success(res, 'list of users');
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  const message = `user ${req.params.id}`;
  log.debug(message);
  return success(res, message);
}
