import express, {Express, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {IConstants} from "./types/constants";
import {init} from "./setup.js";
import resource from "./routes/resource.js";
import user from "./routes/user.js";
import CognitoExpress from "cognito-express";
import {getUserObj} from "./lib/user.js";
import {AccessTokenUserObj, UserObj} from "./types/user";

init();
const {api: {port}}: IConstants = constants;

const app: Express = express();
app.use(cors());
app.use(express.json());

const cognitoExpress = new CognitoExpress({
  region: "us-west-2",
  cognitoUserPoolId: "us-west-2_wvUVsyZMh",
  tokenUse: "access",
  tokenExpiration: 3600000
})

app.use(async (req: Request, res: Response, next: NextFunction) => {
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(401).send("Access Token missing");
  }
  // log.debug({accessToken});
  try {
    const accessTokenUserObj: AccessTokenUserObj = await cognitoExpress.validate(accessToken);
    const userObj: UserObj = await getUserObj(accessTokenUserObj);
    log.debug({userObj});
    res.locals.user = userObj;
  } catch (e) {
    log.error(e);
  }
  next();
});


app.use('/resource', resource);
app.use('/user', user);

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('API Running');
});
// TODO: handle DB connection failure

app.listen(port, (): void => {
  log.info(`API running on port ${port}`);
});

export default app;
