import express, {Router, NextFunction, Request, Response} from "express";

const router: Router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
  res.send('User Route Working')
});

export default router;