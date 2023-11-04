import {NextFunction, Request, Response} from "express";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, success} from "../lib/response.js";
import {listProfessionals} from "../sql/professional.js";

export const adminListProfessionals = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  try {
    const resources: any[] = await listProfessionals();
    return success(res, {data: resources,  count: resources.length})
  } catch (e) {
    return failure(res, e);
  }
}
