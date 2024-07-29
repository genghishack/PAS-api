import express, {Express, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import {IConstants} from "./types/constants";
import {init} from "./init.js";
import professional from "./routes/professional.js";
import user from "./routes/user.js";
import category from "./routes/category.js";
import {authenticateWithCognito} from "./auth.js";

/**
 * Initialization (globals and logging)
 */
init();
const {api: {port}}: IConstants = constants;
const app: Express = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(authenticateWithCognito);

/**
 * Top-Level Routes
 */
app.use('/professional', professional);
app.use('/category', category);
app.use('/user', user);
app.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('API Running');
});

/**
 * Activation
 */
app.listen(port, (): void => {
  log.info(`API running on port ${port}`);
});

export default app;
