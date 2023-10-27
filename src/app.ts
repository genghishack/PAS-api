import express, {Express, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {IConstants} from "./types/constants";
import {defaultCognitoUserObj, init} from "./setup.js";
import resource from "./routes/resource.js";
import user from "./routes/user.js";
import {getUserObj} from "./lib/user.js";
import {AccessTokenUserObj, UserObj} from "./types/user";

init();
const {api: {port}}: IConstants = constants;
const app: Express = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
// Authentication
app.use(async (req: Request, res: Response, next: NextFunction) => {
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
});

/**
 * Top-Level Routes
 */
app.use('/resource', resource);
app.use('/user', user);
app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('API Running');
});

app.listen(port, (): void => {
  log.info(`API running on port ${port}`);
});

export default app;
