import {Response} from 'express';

export const noAccess = (res: Response) => {
  return res.status(403).send("Not Authorized");
}

export const success = (res: Response, body: any) => {
  return res.status(200).send(body);
}

export const successJson = (res: Response, body: any) => {
  return res.status(200).json(body);
}

export const failure = (res: Response, e: any) => { // TODO: Expected to be an error but TS complained - fix
  log.error(e)
  return res.status(500).send(e.message);
}
