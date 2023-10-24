import {NextFunction, Request, Response} from "express";
import {IConstants} from "../types/constants";
import {CognitoUserParams} from "../types/user";
import {getUserModel, isAdmin, isGuest} from "../lib/user.js";
import {failure, noAccess, success} from "../lib/response.js";
import {createCognitoUser, listCognitoUsers} from "../lib/cognito.js";
import {getAdminUserModel} from "../lib/admin.js";

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

// const createUser = async (user, id, data) => {
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   const {user} = res.locals;
//   const data = {email: 'user@example.com'};
//   if (isGuest(user)) return noAccess(res);
//
//   let newUser = {};
//   try {
//     if (isAdmin(user) && data.email) {
//       const newUserParams = {
//         DesiredDeliveryMediums: ['EMAIL'],
//         Username: data.email,
//         UserPoolId: user.userParams.UserPoolId,
//       }
//       newUser = await createCognitoUser(newUserParams);
//     } else {
//       // Regular users can only create their own db record from the event data
//       const [newUserRecord] = await createUserOnSignup(user);
//       newUser = getUserModel(newUserRecord);
//     }
//     return success({data: newUser, count: 1});
//   } catch (e) {
//     return failure(e);
//   }
// }

