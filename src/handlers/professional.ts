import {NextFunction, Request, Response} from "express";
import {isAdmin} from "../lib/user.js";
import {failure, noAccess, success} from "../lib/response.js";
import {getProfessionalById, listProfessionals} from "../sql/professional.js";

export const adminListProfessionals = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);

  try {
    const professionals: any[] = await listProfessionals(false);
    return success(res, {data: professionals,  count: professionals.length})
  } catch (e) {
    return failure(res, e);
  }
}

export const adminGetProfessional = async (req: Request, res: Response, next: NextFunction) => {
  const {user} = res.locals;
  if (!isAdmin(user)) return noAccess(res);
  const {id} = req.params;

  try {
    const [professional]: any = await getProfessionalById(id, false);
    return success(res, {data: professional, count: 1});
  } catch (e) {
    return failure(res, e);
  }
}
