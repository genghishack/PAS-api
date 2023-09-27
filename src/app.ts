import express, {Express, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {IConstants} from "./types/constants";
import {init} from "./setup.js";
import resource from "./routes/resource.js";

init();
const {api: {port}}: IConstants = constants;

const app: Express = express();
app.use(cors());
app.use(express.json());

app.use('/resource', resource);
// app.use('/user', user);

app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('API Running');
});
// TODO: handle DB connection failure

app.listen(port, (): void => {
  log.info(`API running on port ${port}`);
});

export default app;
