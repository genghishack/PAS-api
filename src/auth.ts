import {NextFunction, Request, Response} from "express";
import {IConstants} from "./types/constants";
import {AccessTokenUserObj, UserObj} from "./types/user";
import {defaultCognitoUserObj} from "./defaults.js";
import {getUserObj} from "./lib/user.js";

// Authentication Middleware
export const authenticateWithCognito = async (req: Request, res: Response, next: NextFunction) => {
  const {aws: {cognito: {token}}}: IConstants = constants;
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).send("Access Token missing");
  }
  res.locals.user = defaultCognitoUserObj;
  try {
    const accessTokenUserObj: AccessTokenUserObj = await token.validate(accessToken);
    const userObj: UserObj = await getUserObj(accessTokenUserObj);
    globalThis.log = log.child({userId: userObj.userParams.Username})
    res.locals.user = userObj;
  } catch (e) {
    log.error(e);
    globalThis.log = log.child({userId: null})
  }
  next();
}
